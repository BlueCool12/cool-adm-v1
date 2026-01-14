import { LoginResult } from '@/auth/application/result/login.result';
import { UserResponse } from '@/user/presentation/response/user.response';

export class LoginResponse {
  readonly accessToken: string;
  readonly user: UserResponse;

  private constructor(accessToken: string, user: UserResponse) {
    this.accessToken = accessToken;
    this.user = user;
  }

  static fromResult(result: LoginResult): LoginResponse {
    return new LoginResponse(result.accessToken, UserResponse.fromResult(result.user));
  }
}
