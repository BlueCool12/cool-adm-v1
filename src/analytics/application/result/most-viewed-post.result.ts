import { MostViewedPostData } from '@/analytics/domain/types/analytics.types';

export class MostViewedPostResult {
  id: string;

  title: string;

  views: number;

  static from(domain: MostViewedPostData): MostViewedPostResult {
    const result = new MostViewedPostResult();
    result.id = domain.id;
    result.title = domain.title;
    result.views = parseInt(domain.views, 10);
    return result;
  }
}
