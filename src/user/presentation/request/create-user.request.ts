import { UserRole } from '@/user/domain/user-role.enum';
import { IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty({ message: '아이디는 필수입니다' })
  @Matches(/^[a-z0-9]+$/, { message: '아이디는 영문 소문자와 숫자만 가능합니다' })
  readonly loginId: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수입니다' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' })
  readonly password: string;

  @IsString()
  @IsNotEmpty({ message: '이름은 필수입니다' })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: '활동명(닉네임)은 필수입니다' })
  readonly nickname: string;

  @IsEnum(UserRole, { message: '올바른 권한을 선택해주세요' })
  readonly role: UserRole;
}
