import { PostStatus } from '@/post/domain/post-status.enum';
import { GetPostResult } from '@/post/application/result/get-post.result';

export class GetPostResponse {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly content: string,
    readonly contentJson: string | null,
    readonly publishInfo: PublishInfoResponse,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static fromResult(result: GetPostResult): GetPostResponse {
    return new GetPostResponse(
      result.id,
      result.title,
      result.content,
      result.contentJson,
      {
        slug: result.slug,
        description: result.description,
        category:
          result.categoryName && result.categoryId !== null
            ? {
                id: result.categoryId,
                name: result.categoryName,
              }
            : null,
        status: result.status,
        publishedAt: result.publishedAt,
      },
      result.createdAt,
      result.updatedAt,
    );
  }
}

class PublishInfoResponse {
  readonly slug: string | null;
  readonly description: string;
  readonly category?: {
    readonly id: number;
    readonly name: string;
  } | null;
  readonly status: PostStatus;
  readonly publishedAt: Date | null;
}
