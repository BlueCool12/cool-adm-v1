import { TrafficData } from '@/analytics/domain/types/analytics.types';

export class TrafficDataResult {
  date: string;

  pv: number;

  uv: number;

  static from(domain: TrafficData): TrafficDataResult {
    const result = new TrafficDataResult();
    result.date = domain.date;
    result.pv = domain.pv;
    result.uv = domain.uv;
    return result;
  }
}
