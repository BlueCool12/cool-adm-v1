import { MostViewedPostResult } from '@/analytics/application/result/most-viewed-post.result';

export class TopPostResponse {
  id: string;

  title: string;

  views: number;

  static from(result: MostViewedPostResult): TopPostResponse {
    const response = new TopPostResponse();
    response.id = result.id;
    response.title = result.title;
    response.views = result.views;
    return response;
  }
}
