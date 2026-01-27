import { TrafficRange } from '@/analytics/domain/types/analytics.types';

export class GetTrafficQuery {
  range: TrafficRange;

  constructor(range: TrafficRange) {
    this.range = range;
  }
}
