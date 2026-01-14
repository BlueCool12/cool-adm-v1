import { CreatePostResult } from '@/post/application/result/create-post.result';

export class CreatePostResponse {
  readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  static fromResult(result: CreatePostResult): CreatePostResponse {
    return new CreatePostResponse(result.id);
  }
}
