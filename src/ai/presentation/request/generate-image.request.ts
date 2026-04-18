import { IsString } from 'class-validator';

export class GenerateImageRequest {
  @IsString()
  content!: string;
}
