import { TrafficRange } from '@/analytics/domain/types/analytics.types';
import { IsEnum, IsOptional } from 'class-validator';

export class getTrafficRequest {
  @IsOptional()
  @IsEnum(TrafficRange, { message: 'range는 7d 또는 30d여야 합니다.' })
  range: TrafficRange = TrafficRange.SEVEN_DAYS;
}
