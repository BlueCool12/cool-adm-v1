import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AnalyticsService } from '@/analytics/application/analytics.service';
import { getTrafficRequest } from '@/analytics/presentation/request/get-traffic.request';
import { GetTopPostsRequest } from '@/analytics/presentation/request/get-top-posts.request';
import { GetPostPerformanceRequest } from '@/analytics/presentation/request/get-post-performance.request';
import { AnalyticsSummaryResponse } from '@/analytics/presentation/response/analytics-summary.response';
import { TrafficDataResponse } from '@/analytics/presentation/response/traffic-data.response';
import { TopPostResponse } from '@/analytics/presentation/response/top-post.response';
import {
  PaginatedPostPerformanceResponse,
  PostPerformanceResponse,
} from '@/analytics/presentation/response/post-performance.response';
import { DistributionResponse } from '@/analytics/presentation/response/distribution.response';
import { DashboardSummaryResponse } from '@/analytics/presentation/response/dashboard-summary.response';
import { RecentCommentResponse } from '@/analytics/presentation/response/recent-comment.response';
import { GetTrafficQuery } from '@/analytics/application/query/get-traffic.query';
import { GetTopPostsQuery } from '@/analytics/application/query/get-top-posts.query';
import { GetPostPerformanceQuery } from '@/analytics/application/query/get-post-performance.query';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/summary')
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const result = await this.analyticsService.getDashboardSummary();
    return DashboardSummaryResponse.from(result);
  }

  @Get('comments/recent')
  async getRecentComments(): Promise<RecentCommentResponse[]> {
    const results = await this.analyticsService.getRecentComments();
    return results.map((result) => RecentCommentResponse.from(result));
  }

  @Get('summary')
  async getStatSummary(): Promise<AnalyticsSummaryResponse[]> {
    const summaries = await this.analyticsService.getAnalyticsSummary();
    return summaries.map((summary) => AnalyticsSummaryResponse.from(summary));
  }

  @Get('traffic')
  async getTrafficData(
    @Query(new ValidationPipe({ transform: true })) request: getTrafficRequest,
  ): Promise<TrafficDataResponse[]> {
    const query = new GetTrafficQuery(request.range);
    const results = await this.analyticsService.getTrafficData(query);
    return results.map((result) => TrafficDataResponse.from(result));
  }

  @Get('ranks/posts')
  async getTopPosts(
    @Query(new ValidationPipe({ transform: true })) request: GetTopPostsRequest,
  ): Promise<TopPostResponse[]> {
    const query = new GetTopPostsQuery(request.limit);
    const results = await this.analyticsService.getMostViewedPosts(query);
    return results.map((result) => TopPostResponse.from(result));
  }

  @Get('posts')
  async getPostPerformance(
    @Query(new ValidationPipe({ transform: true })) request: GetPostPerformanceRequest,
  ): Promise<PaginatedPostPerformanceResponse> {
    const query = new GetPostPerformanceQuery(request.page, request.limit);
    const { items, total } = await this.analyticsService.getPostPerformance(query);
    return { items: items.map((item) => PostPerformanceResponse.from(item)), total };
  }

  @Get('distribution/referrer')
  async getDistribution(): Promise<DistributionResponse[]> {
    const results = await this.analyticsService.getReferrerStats();
    return results.map((result) => DistributionResponse.from(result));
  }

  @Get('distribution/device')
  async getDeviceStats(): Promise<DistributionResponse[]> {
    const results = await this.analyticsService.getDeviceStats();
    return results.map((result) => DistributionResponse.from(result));
  }
}
