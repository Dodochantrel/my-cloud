import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/roles/role.enum';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashsService } from 'src/utils/hashs.service';
import { TokensService } from 'src/utils/tokens.service';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly hashsService: HashsService,
  ) {}

  async login(email: string, password: string, rememberMe: boolean) {
    const user = await this.usersService.getOneByEmail(email, ['groups']);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await this.hashsService.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isAuthorized) {
      throw new ForbiddenException('User is not authorized');
    }
    const accessTokenPromise = this.generateAccessToken(user);
    const refreshTokenPromise = this.generateRefreshToken(user, rememberMe);

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const hashedPassword = await this.hashsService.hash(password);
    const existingUser = await this.usersService.getOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    user.roles.push(Role.User);
    if (await this.usersService.isFirstUser()) {
      user.isAuthorized = true;
      user.roles.push(Role.Admin);
    }
    return await this.usersService.save(user);
  }

  async refreshTokens(userId: number) {
    const user = await this.usersService.getOneById(userId, ['groups']);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isAuthorized) {
      throw new UnauthorizedException('User is not authorized');
    }
    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
      user,
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.tokensService.generateAccessToken(
      user.id,
      user.email,
      user.groups.map((group) => group.id),
      user.roles,
    );
  }

  async generateRefreshToken(user: User, rememberMe: boolean): Promise<string> {
    return this.tokensService.generateRefreshToken(user.id, rememberMe);
  }
}
