import { PostStatus } from '@/post/domain/post-status.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  contentJson?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsEnum(PostStatus)
  status: PostStatus;
}
