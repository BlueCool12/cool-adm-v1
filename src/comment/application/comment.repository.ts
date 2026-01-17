import { Comment } from '@/comment/domain/comment.entity';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<Comment>;

  abstract findById(id: string): Promise<Comment | null>;

  abstract findAll(options: {
    skip: number;
    take: number;
    replied?: boolean;
  }): Promise<[Comment[], number]>;
}
