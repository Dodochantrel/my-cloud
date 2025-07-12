import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationsService } from './authentications.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import {
  LoginResponseDto,
  mapFromUserToLoginResponseDto,
} from './dtos/login-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RefreshGuard } from './refresh.guard';
import { RefreshTokenPayload } from 'src/utils/tokens.service';

@Controller('authentications')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Post('login')
  @ApiBody({
    type: LoginRequestDto,
    description: 'Login request body',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  async login(
    @Body() body: LoginRequestDto,
    @Res() res: Response,
  ): Promise<Response> {
    const loginResponse = await this.authenticationsService.login(
      body.email,
      body.password,
      body.rememberMe,
    );
    return this.prepareCookies(
      loginResponse.accessToken,
      loginResponse.refreshToken,
      res,
    )
      .status(200)
      .json(mapFromUserToLoginResponseDto(loginResponse.user));
  }

  @Post('register')
  @ApiBody({
    type: RegisterRequestDto,
    description: 'Register request body',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
  })
  async register(@Body() body: RegisterRequestDto): Promise<void> {
    await this.authenticationsService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    type: LoginResponseDto,
  })
  async refresh(
    @Res() res: Response,
    @RefreshTokenPayload() user: RefreshTokenPayload,
  ): Promise<Response> {
    const refreshResponse = await this.authenticationsService.refreshTokens(
      user.id,
    );
    return this.prepareAccessTokenCookie(refreshResponse.accessToken, res)
      .status(200)
      .json(mapFromUserToLoginResponseDto(refreshResponse.user));
  }

  private prepareCookies(
    accessToken: string,
    refreshToken: string,
    res: Response,
  ): Response {
    res = this.prepareAccessTokenCookie(accessToken, res);
    res = this.prepareRefreshTokenCookie(refreshToken, res);
    return res;
  }

  private prepareAccessTokenCookie(
    accessToken: string,
    res: Response,
  ): Response {
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
    });
    return res;
  }

  private prepareRefreshTokenCookie(
    refreshToken: string,
    res: Response,
  ): Response {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res;
  }
}
