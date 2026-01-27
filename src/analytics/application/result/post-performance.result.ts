import { PostPerformanceData } from '@/analytics/domain/types/analytics.types';

export class PostPerformanceResult {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date;
  views: number;
  uv: number;

  static from(data: PostPerformanceData): PostPerformanceResult {
    const result = new PostPerformanceResult();
    result.id = data.id;
    result.title = data.title;
    result.slug = data.slug;
    result.publishedAt = data.publishedAt;
    result.views = parseInt(data.views, 10);
    result.uv = parseInt(data.uv, 10);
    return result;
  }
}

export class PaginatedPostPerformanceResult {
  items: PostPerformanceResult[];
  total: number;
}
