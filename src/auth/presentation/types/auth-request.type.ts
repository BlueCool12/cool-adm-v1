import { Request } from 'express';
import { UserRole } from '@/user/domain/user-role.enum';

export interface CurrentUserPayload {
  id: string;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user: CurrentUserPayload;
}

export interface RequestWithRefreshToken extends Request {
  user: CurrentUserPayload & { refreshToken: string };
}
