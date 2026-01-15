import { PageRequest } from '@/common/request/page-request';
import { UserRole } from '@/user/domain/user-role.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUsersRequest extends PageRequest {
  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;

  @IsOptional()
  @IsString()
  readonly search?: string;
}
