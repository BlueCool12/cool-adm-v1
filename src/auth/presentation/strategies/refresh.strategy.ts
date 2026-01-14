import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.signedCookies && req.signedCookies.rt) return req.signedCookies.rt as string;
          if (req.cookies && req.cookies.rt) return req.cookies.rt as string;
          return null;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: { sub: string }) {
    const refreshToken = (req.signedCookies?.rt ?? req.cookies?.rt) as string;
    if (!refreshToken) throw new UnauthorizedException('Refresh token not found');
    return { userId: payload.sub, refreshToken };
  }
}
