import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/application/auth.service';
import { Public } from '@/auth/presentation/decorators/public.decorator';
import { LoginRequest } from '@/auth/presentation/request/login.request';

import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/auth/presentation/decorators/current-user.decorator';
import { CookieOptions, Response } from 'express';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import {
  CurrentUserPayload,
  RequestWithRefreshToken,
} from '@/auth/presentation/types/auth-request.type';
import { LoginResponse } from '@/auth/presentation/response/login.response';
import { ConfigService } from '@nestjs/config';
import { AuthUserResponse } from '@/user/presentation/response/auth-user.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() req: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(req.loginId, req.password);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return LoginResponse.fromResult(result);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: CurrentUserPayload): Promise<AuthUserResponse> {
    const result = await this.authService.findMe(user.userId);
    return AuthUserResponse.fromResult(result);
  }

  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: RequestWithRefreshToken, @Res({ passthrough: true }) res: Response) {
    const { userId, refreshToken } = req.user;

    const { accessToken, newRefreshToken } = await this.authService.refresh(userId, refreshToken);

    this.setRefreshTokenCookie(res, newRefreshToken);

    return { accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: CurrentUserPayload, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.userId);
    this.clearRefreshTokenCookie(res);
    return { success: true };
  }

  private getCookieOptions(): CookieOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');
    const isProd = nodeEnv === 'production';

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: cookieDomain || undefined,
      path: '/',
      signed: true,
    };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('rt', token, {
      ...this.getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('rt', this.getCookieOptions());
  }
}
