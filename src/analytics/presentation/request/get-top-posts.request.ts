import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetTopPostsRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20, { message: '랭킹은 최대 20개까지만 조회 가능합니다.' })
  limit: number = 5;
}
