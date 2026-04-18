import { UserRole } from '@/user/domain/user-role.enum';
import { User } from '@/user/domain/user.entity';

export class UserResult {
  constructor(
    public readonly id: string,
    public readonly loginId: string,
    public readonly name: string | null,
    public readonly nickname: string | null,
    public readonly role: UserRole,
    public readonly lastLoginAt: Date | null,
    public readonly lockedUntil: Date | null,
  ) {}

  static fromEntity(user: User): UserResult {
    return new UserResult(
      user.id,
      user.getLoginId(),
      user.getName(),
      user.getNickname(),
      user.getRole(),
      user.lastLoginAt ?? null,
      user.getLockedUntil(),
    );
  }
}
