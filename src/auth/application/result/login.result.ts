import { AuthUserResult } from '@/user/application/result/auth-user.result';

export class LoginResult {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly user: AuthUserResult,
  ) {}
}
