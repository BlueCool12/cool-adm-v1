import { Post } from '@/post/domain/post.entity';
import { GetPostResult } from '@/post/application/result/get-post.result';

export class GetPostsResult {
  readonly items: GetPostResult[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;

  constructor(props: { items: GetPostResult[]; total: number; page: number; lastPage: number }) {
    this.items = props.items;
    this.total = props.total;
    this.page = props.page;
    this.lastPage = props.lastPage;
  }

  static fromEntities(
    entities: Post[],
    total: number,
    page: number,
    limit: number,
  ): GetPostsResult {
    return new GetPostsResult({
      items: entities.map((entity) => GetPostResult.fromEntity(entity)),
      total,
      page,
      lastPage: Math.ceil(total / limit) || 1,
    });
  }
}
