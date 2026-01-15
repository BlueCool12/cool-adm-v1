import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequest {
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}
