import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '@/analytics/application/analytics.repository';
import {
  calculateBounceRate,
  calculateTrend,
  fillEmptyDates,
  getStartDate,
  getTodayComparisonRanges,
} from '@/analytics/domain/analytics.logic';
import { TrafficData, TrafficRange } from '../domain/types/analytics.types';
import { AnalyticsSummaryResult } from './result/analytics-summary.result';
import { GetTrafficQuery } from './query/get-traffic.query';
import { TrafficDataResult } from './result/traffic-data.result';
import { GetTopPostsQuery } from './query/get-top-posts.query';
import { MostViewedPostResult } from './result/most-viewed-post.result';
import { GetPostPerformanceQuery } from './query/get-post-performance.query';
import {
  PaginatedPostPerformanceResult,
  PostPerformanceResult,
} from './result/post-performance.result';
import { DistributionResult } from './result/distribution.result';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getDashboardStats() {
    const { todayStart, todayEnd } = getTodayComparisonRanges();

    const [todayPv, todayUv, pendingComments, totalPosts, weeklyTopPosts, trafficRaw] =
      await Promise.all([
        this.analyticsRepository.getPvCount(todayStart, todayEnd),
        this.analyticsRepository.getUvCount(todayStart, todayEnd),
        this.analyticsRepository.getPendingCommentCount(),
        this.analyticsRepository.getTotalPostCount(),
        this.getMostViewedPosts({ limit: 3 }),
        this.analyticsRepository.getTrafficRawData(getStartDate(7)),
      ]);

    const trend = fillEmptyDates(trafficRaw, 7, getStartDate(7));

    const recentComments = await this.analyticsRepository.getRecentComments();

    return {
      summary: {
        todayPv,
        todayUv,
        pendingComments,
        totalPosts,
      },
      trend,
      recentComments,
      weeklyTopPosts,
    };
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummaryResult[]> {
    const { todayStart, todayEnd, yesterdayStart, yesterdayEnd } = getTodayComparisonRanges();

    const [today, yesterday] = await Promise.all([
      this.getPeriodMetrics(todayStart, todayEnd),
      this.getPeriodMetrics(yesterdayStart, yesterdayEnd),
    ]);

    return [
      {
        title: '오늘 방문자 (UV)',
        value: today.uv,
        trend: calculateTrend(today.uv, yesterday.uv),
        diff: today.uv - yesterday.uv,
        unit: '명',
      },
      {
        title: '오늘 조회수 (PV)',
        value: today.pv,
        trend: calculateTrend(today.pv, yesterday.pv),
        diff: today.pv - yesterday.pv,
        unit: '회',
      },
      {
        title: '평균 체류 시간',
        value: today.duration,
        trend: calculateTrend(today.duration, yesterday.duration),
        diff: today.duration - yesterday.duration,
        unit: '초',
      },
      {
        title: '이탈률',
        value: today.bounceRate,
        trend: calculateTrend(today.bounceRate, yesterday.bounceRate),
        diff: today.bounceRate - yesterday.bounceRate,
        unit: '%',
      },
    ];
  }

  async getTrafficData(query: GetTrafficQuery): Promise<TrafficData[]> {
    const { range } = query;
    const days = range === TrafficRange.SEVEN_DAYS ? 7 : 30;
    const startDate = getStartDate(days);

    const rawData = await this.analyticsRepository.getTrafficRawData(startDate);
    const domainData = fillEmptyDates(rawData, days, startDate);

    return domainData.map((item) => TrafficDataResult.from(item));
  }

  async getMostViewedPosts(query: GetTopPostsQuery): Promise<MostViewedPostResult[]> {
    const { limit } = query;
    const startDate = getStartDate(7);
    const rawData = await this.analyticsRepository.getMostViewedPosts(startDate, limit);

    return rawData.map((item) => MostViewedPostResult.from(item));
  }

  async getPostPerformance(
    query: GetPostPerformanceQuery,
  ): Promise<PaginatedPostPerformanceResult> {
    const { page, limit } = query;
    const { data, total } = await this.analyticsRepository.getPostPerformance(page, limit);

    const items = data.map((item) => PostPerformanceResult.from(item));
    return { items, total };
  }

  async getReferrerStats(): Promise<DistributionResult[]> {
    const rawData = await this.analyticsRepository.getReferrerStats();
    return rawData.map((item, index) => DistributionResult.from(item, index));
  }

  async getDeviceStats(): Promise<DistributionResult[]> {
    const rawData = await this.analyticsRepository.getDeviceStats();
    return rawData.map((item, index) => DistributionResult.from(item, index));
  }

  private async getPeriodMetrics(start: Date, end: Date) {
    const [pv, uv, bounceStats, duration] = await Promise.all([
      this.analyticsRepository.getPvCount(start, end),
      this.analyticsRepository.getUvCount(start, end),
      this.analyticsRepository.getBounceRateStats(start, end),
      this.analyticsRepository.getAvgDurationSeconds(start, end),
    ]);

    return {
      pv,
      uv,
      duration,
      bounceRate: calculateBounceRate(bounceStats.total, bounceStats.bounced),
    };
  }
}
