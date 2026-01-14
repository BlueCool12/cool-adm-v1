import { UserResult } from '@/user/application/result/user.result';

export class LoginResult {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly user: UserResult,
  ) {}
}
