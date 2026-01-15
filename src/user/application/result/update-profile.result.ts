import { User } from '@/user/domain/user.entity';

export class UpdateProfileResult {
  constructor(
    public readonly id: string,
    public readonly nickname: string | null,
    public readonly profileImageUrl: string | null,
  ) {}

  static fromEntity(user: User): UpdateProfileResult {
    return new UpdateProfileResult(user.id, user.getNickname(), user.getProfileImageUrl());
  }
}
