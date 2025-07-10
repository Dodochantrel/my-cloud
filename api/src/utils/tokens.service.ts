import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(
    id: number,
    email: string,
    groupsId: number[],
  ): Promise<string> {
    const payload: AccessTokenPayload = { id, email, groupsId };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_LIFETIME'),
      ),
    });
  }

  async generateRefreshToken(id: number, rememberMe: boolean): Promise<string> {
    const payload: RefreshTokenPayload = { id };
    const lifetime = rememberMe
      ? this.configService.get<string>('JWT_REFRESH_LIFETIME_REMEMBER')
      : this.configService.get<string>('JWT_REFRESH_LIFETIME');
    return this.jwtService.signAsync(payload, {
      secret: lifetime,
      expiresIn: parseInt(
        this.configService.get<string>('JWT_REFRESH_LIFETIME'),
      ),
    });
  }
}

export interface AccessTokenPayload {
  id: number;
  email: string;
  groupsId: number[];
}

export interface RefreshTokenPayload {
  id: number;
}

export const TokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization) {
      return null;
    }
    const accessToken = request.headers.authorization.split(' ')[1];
    return jwtDecode<AccessTokenPayload>(accessToken);
  },
);

export const RefreshTokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.cookies || !request.cookies.refreshToken) {
      return null;
    }
    const refreshToken = request.cookies.refreshToken;
    return jwtDecode<RefreshTokenPayload>(refreshToken);
  },
);
