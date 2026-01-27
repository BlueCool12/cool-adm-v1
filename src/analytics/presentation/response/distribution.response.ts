import { DistributionResult } from '@/analytics/application/result/distribution.result';

export class DistributionResponse {
  id: number;

  label: string;

  value: number;

  static from(result: DistributionResult): DistributionResponse {
    const response = new DistributionResponse();
    response.id = result.id;
    response.label = result.label;
    response.value = result.value;
    return response;
  }
}
