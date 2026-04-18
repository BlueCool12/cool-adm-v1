import { IsString } from 'class-validator';

export class CreateReplyRequest {
  @IsString()
  content!: string;
}
