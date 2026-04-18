import { PostStatus } from '@/post/domain/post-status.enum';
import { Post } from '@/post/domain/post.entity';

export class GetPostResult {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly content: string,
    readonly contentJson: string | null,
    readonly categoryId: number | null,
    readonly categoryName: string | null,
    readonly slug: string | null,
    readonly description: string | null,
    readonly status: PostStatus,
    readonly publishedAt: Date | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) { }

  static fromEntity(post: Post): GetPostResult {
    return new GetPostResult(
      post.id,
      post.getTitle(),
      post.getContent(),
      post.getContentJson(),
      post.getCategoryId(),
      post.getCategory()?.getName() || null,
      post.getSlug(),
      post.getDescription() ?? null,
      post.getStatus(),
      post.getPublishedAt(),
      post.createdAt,
      post.updatedAt,
    );
  }
}
