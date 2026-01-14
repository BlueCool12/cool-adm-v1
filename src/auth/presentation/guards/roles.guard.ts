import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/user/domain/user-role.enum';
import { RequestWithUser } from '@/auth/presentation/types/auth-request.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const user = req.user;
    if (!user?.role) throw new ForbiddenException('권한 정보가 없습니다.');
    if (!required.includes(user.role)) throw new ForbiddenException('접근 권한이 없습니다.');

    return true;
  }
}
