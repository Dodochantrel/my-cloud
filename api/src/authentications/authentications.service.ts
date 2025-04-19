import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async login(email: string, password: string) {
    const user = await this.usersService.getOneByEmail(email, ['groups']);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!this.hashsService.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isAuthorized) {
      throw new UnauthorizedException('User is not authorized');
    }
    const accessTokenPromise = this.generateAccessToken(user);
    const refreshTokenPromise = this.generateRefreshToken(user);

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
    return await this.usersService.save(
      new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      }),
    );
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.tokensService.generateAccessToken(
      user.id,
      user.email,
      user.groups.map((group) => group.id),
    );
  }

  async generateRefreshToken(user: User): Promise<string> {
    return this.tokensService.generateRefreshToken(user.id);
  }
}
