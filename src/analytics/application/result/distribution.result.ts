import { DistributionData } from '@/analytics/domain/types/analytics.types';

export class DistributionResult {
  id!: number;
  label!: string;
  value!: number;

  static from(data: DistributionData, index: number): DistributionResult {
    const result = new DistributionResult();
    result.id = index;
    result.label = data.label;
    result.value = parseInt(data.value, 10);
    return result;
  }
}
