import { UserRole } from '@/user/domain/user-role.enum';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsOptional()
  @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
  password?: string;

  @IsString()
  name: string;

  @IsString()
  nickname: string;

  @IsEnum(UserRole)
  role: UserRole;
}
