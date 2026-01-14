import { UserResult } from '@/user/application/result/user.result';
import { UserRole } from '@/user/domain/user-role.enum';

export class UserResponse {
  readonly id: string;
  readonly loginId: string;
  readonly name: string | null;
  readonly nickname: string | null;
  readonly role: UserRole;

  private constructor(
    id: string,
    loginId: string,
    name: string | null,
    nickname: string | null,
    role: UserRole,
  ) {
    this.id = id;
    this.loginId = loginId;
    this.name = name;
    this.nickname = nickname;
    this.role = role;
  }

  static fromResult(result: UserResult): UserResponse {
    return new UserResponse(result.id, result.loginId, result.name, result.nickname, result.role);
  }
}
