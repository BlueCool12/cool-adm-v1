import { GetPostsResult } from '@/post/application/result/get-posts.result';
import { GetPostResponse } from '@/post/presentation/response/get-post.response';

export class GetPostListResponse {
  readonly items: GetPostResponse[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;

  constructor(props: { items: GetPostResponse[]; total: number; page: number; lastPage: number }) {
    this.items = props.items;
    this.total = props.total;
    this.page = props.page;
    this.lastPage = props.lastPage;
  }

  static fromResult(result: GetPostsResult): GetPostListResponse {
    return new GetPostListResponse({
      items: result.items.map((item) => GetPostResponse.fromResult(item)),
      total: result.total,
      page: result.page,
      lastPage: result.lastPage,
    });
  }
}
