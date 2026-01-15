import { UserRole } from '@/user/domain/user-role.enum';
import { User } from '@/user/domain/user.entity';

export class AuthUserResult {
  constructor(
    public readonly id: string,
    public readonly loginId: string,
    public readonly name: string | null,
    public readonly nickname: string | null,
    public readonly profileImageUrl: string | null,
    public readonly role: UserRole,
  ) {}

  static fromEntity(user: User): AuthUserResult {
    return new AuthUserResult(
      user.id,
      user.getLoginId(),
      user.getName(),
      user.getNickname(),
      user.getProfileImageUrl(),
      user.getRole(),
    );
  }
}
