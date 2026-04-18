import { DashboardSummaryResult } from '@/analytics/application/result/dashboard-summary.result';

export class DashboardSummaryResponse {
  todayPv!: number;
  todayUv!: number;
  pendingComments!: number;
  totalPosts!: number;

  static from(result: DashboardSummaryResult): DashboardSummaryResponse {
    const response = new DashboardSummaryResponse();
    response.todayPv = result.todayPv;
    response.todayUv = result.todayUv;
    response.pendingComments = result.pendingComments;
    response.totalPosts = result.totalPosts;
    return response;
  }
}
