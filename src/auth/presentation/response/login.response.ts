import { LoginResult } from '@/auth/application/result/login.result';
import { AuthUserResponse } from '@/user/presentation/response/auth-user.response';

export class LoginResponse {
  readonly accessToken: string;
  readonly user: AuthUserResponse;

  private constructor(accessToken: string, user: AuthUserResponse) {
    this.accessToken = accessToken;
    this.user = user;
  }

  static fromResult(result: LoginResult): LoginResponse {
    return new LoginResponse(result.accessToken, AuthUserResponse.fromResult(result.user));
  }
}
