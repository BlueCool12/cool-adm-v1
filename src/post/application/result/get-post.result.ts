import { PostStatus } from '@/post/domain/post-status.enum';
import { Post } from '@/post/domain/post.entity';

export class GetPostResult {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly content: string,
    readonly categoryId: number | null,
    readonly slug: string | null,
    readonly description: string,
    readonly status: PostStatus,
    readonly publishedAt: Date | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static fromEntity(post: Post): GetPostResult {
    return new GetPostResult(
      post.id,
      post.getTitle(),
      post.getContent(),
      post.getCategoryId(),
      post.getSlug(),
      post.getDescription(),
      post.getStatus(),
      post.getPublishedAt(),
      post.createdAt,
      post.updatedAt,
    );
  }
}
