import { PostPerformanceResult } from '@/analytics/application/result/post-performance.result';

export class PostPerformanceResponse {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date;
  views: number;
  uv: number;

  static from(result: PostPerformanceResult): PostPerformanceResponse {
    const response = new PostPerformanceResponse();
    response.id = result.id;
    response.title = result.title;
    response.slug = result.slug;
    response.publishedAt = result.publishedAt;
    response.views = result.views;
    response.uv = result.uv;
    return response;
  }
}

export class PaginatedPostPerformanceResponse {
  items: PostPerformanceResponse[];
  total: number;
}
