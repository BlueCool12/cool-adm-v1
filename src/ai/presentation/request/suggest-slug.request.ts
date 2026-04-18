import { IsString } from 'class-validator';

export class SuggestSlugRequest {
  @IsString()
  title!: string;
}
