import { AnalyticsSummaryResult } from '@/analytics/application/result/analytics-summary.result';

export class AnalyticsSummaryResponse {
  title: string;

  value: string | number;

  trend: number;

  diff: number | string;

  unit: string;

  static from(result: AnalyticsSummaryResult): AnalyticsSummaryResponse {
    const response = new AnalyticsSummaryResponse();
    response.title = result.title;
    response.value = result.value;
    response.trend = result.trend;
    response.diff = result.diff;
    response.unit = result.unit;
    return response;
  }
}
