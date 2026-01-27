import { TrafficDataResult } from '@/analytics/application/result/traffic-data.result';

export class TrafficDataResponse {
  date: string;

  pv: number;

  uv: number;

  static from(result: TrafficDataResult): TrafficDataResponse {
    const response = new TrafficDataResponse();
    response.date = result.date;
    response.pv = result.pv;
    response.uv = result.uv;
    return response;
  }
}
