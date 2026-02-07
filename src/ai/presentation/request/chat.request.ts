import { IsString } from 'class-validator';

export class ChatRequest {
  @IsString()
  message: string;
}
