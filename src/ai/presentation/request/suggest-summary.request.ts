import { IsString } from 'class-validator';

export class SuggestSummaryRequest {
  @IsString()
  content!: string;
}
