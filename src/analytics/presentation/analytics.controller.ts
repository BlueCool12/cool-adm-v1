import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service';
import { AnalyticsSummaryResponse } from './response/analytics-summary.response';
import { getTrafficRequest } from './request/get-traffic.request';
import { GetTrafficQuery } from '../application/query/get-traffic.query';
import { TrafficDataResponse } from './response/traffic-data.response';
import { GetTopPostsRequest } from './request/get-top-posts.request';
import { GetTopPostsQuery } from '../application/query/get-top-posts.query';
import { TopPostResponse } from './response/top-post.response';
import { GetPostPerformanceRequest } from './request/get-post-performance.request';
import {
  PaginatedPostPerformanceResponse,
  PostPerformanceResponse,
} from './response/post-performance.response';
import { GetPostPerformanceQuery } from '../application/query/get-post-performance.query';
import { DistributionResponse } from './response/distribution.response';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
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
