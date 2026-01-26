import {
  DailyVisitData,
  MostViewedPostData,
  PostPerformanceData,
  ReferrerData,
} from '@/analytics/domain/types/analytics.types';

export abstract class AnalyticsRepository {
  abstract getPvCount(start: Date, end: Date): Promise<number>;

  abstract getUvCount(start: Date, end: Date): Promise<number>;

  abstract getBounceRateStats(start: Date, end: Date): Promise<{ total: number; bounced: number }>;

  abstract getAvgDurationSeconds(start: Date, end: Date): Promise<number>;

  abstract getTrafficRawData(start: Date): Promise<DailyVisitData[]>;

  abstract getMostViewedPosts(dateLimit: Date, limit: number): Promise<MostViewedPostData[]>;

  abstract getPostPerformance(
    page: number,
    limit: number,
  ): Promise<{ data: PostPerformanceData[]; total: number }>;

  abstract getReferrerStats(): Promise<ReferrerData[]>;

  abstract getDeviceStats(): Promise<ReferrerData[]>;

  abstract getPendingCommentCount(): Promise<number>;

  abstract getRecentComments(): Promise<any[]>;

  abstract getTotalPostCount(): Promise<number>;
}
