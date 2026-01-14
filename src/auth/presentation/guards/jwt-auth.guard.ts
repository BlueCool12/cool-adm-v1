import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/auth/presentation/decorators/public.decorator';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserPayload } from '@/auth/presentation/types/auth-request.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = CurrentUserPayload>(err: unknown, user: TUser): TUser {
    if (err) {
      if (err instanceof Error) throw err;
      throw new UnauthorizedException(err);
    }

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
