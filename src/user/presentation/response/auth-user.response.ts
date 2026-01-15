import { AuthUserResult } from '@/user/application/result/auth-user.result';
import { UserRole } from '@/user/domain/user-role.enum';

export class AuthUserResponse {
  public readonly id: string;
  public readonly loginId: string;
  public readonly name: string | null;
  public readonly nickname: string | null;
  public readonly profileImageUrl: string | null;
  public readonly role: UserRole;

  private constructor(
    id: string,
    loginId: string,
    name: string | null,
    nickname: string | null,
    profileImageUrl: string | null,
    role: UserRole,
  ) {
    this.id = id;
    this.loginId = loginId;
    this.name = name;
    this.nickname = nickname;
    this.profileImageUrl = profileImageUrl;
    this.role = role;
  }

  static fromResult(result: AuthUserResult): AuthUserResponse {
    return new AuthUserResponse(
      result.id,
      result.loginId,
      result.name,
      result.nickname,
      result.profileImageUrl,
      result.role,
    );
  }
}
