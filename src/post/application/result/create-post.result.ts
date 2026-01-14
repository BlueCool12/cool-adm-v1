import { Post } from '@/post/domain/post.entity';

export class CreatePostResult {
  constructor(readonly id: string) {}

  static fromEntity(post: Post): CreatePostResult {
    return new CreatePostResult(post.id);
  }
}
