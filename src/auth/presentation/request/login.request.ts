import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  loginId!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(255)
  password!: string;
}
