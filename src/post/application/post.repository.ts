import { Post } from '@/post/domain/post.entity';

export abstract class PostRepository {
  abstract save(post: Post): Promise<Post>;

  abstract findById(id: string): Promise<Post | null>;

  abstract findAll(options: {
    search?: string;
    status?: string;
    categoryId?: number;
    startDate?: string;
    endDate?: string;
    skip: number;
    take: number;
  }): Promise<[Post[], number]>;

  abstract delete(id: string): Promise<void>;

  abstract countByCategoryId(categoryId: number): Promise<number>;
}
