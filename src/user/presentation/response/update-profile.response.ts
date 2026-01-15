import { UpdateProfileResult } from '@/user/application/result/update-profile.result';

export class UpdateProfileResponse {
  readonly nickname: string | null;
  readonly profileImageUrl: string | null;

  constructor(result: UpdateProfileResult) {
    this.nickname = result.nickname;
    this.profileImageUrl = result.profileImageUrl;
  }
}
