import { Brackets, Repository } from 'typeorm';
import { PostRepository } from '@/post/application/post.repository';
import { Post } from '@/post/domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmPostRepository extends PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    super();
  }

  async save(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  async findById(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['medias', 'category'],
    });
  }

  async findAll(options: {
    search?: string;
    status?: string;
    categoryId?: number;
    startDate?: string;
    endDate?: string;
    skip: number;
    take: number;
  }): Promise<[Post[], number]> {
    const { search, status, categoryId, startDate, endDate, skip, take } = options;
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('post.title LIKE :search', { search: `%${search}%` }).orWhere(
            'post.content LIKE :search',
            { search: `%${search}%` },
          );
        }),
      );
    }

    if (status) queryBuilder.andWhere('post.status = :status', { status });
    if (categoryId) queryBuilder.andWhere('post.categoryId = :categoryId', { categoryId });
    if (startDate && endDate) {
      queryBuilder.andWhere('post.createdAt BETWEEN :startDate AND :endDate', {
        startDate: `${startDate} 00:00:00`,
        endDate: `${endDate} 23:59:59`,
      });
    }

    queryBuilder.orderBy('post.createdAt', 'DESC').skip(skip).take(take);

    return await queryBuilder.getManyAndCount();
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.softDelete(id);
  }

  async countByCategoryId(categoryId: number): Promise<number> {
    return await this.postRepository.count({
      where: {
        ['categoryId' as keyof Post]: categoryId,
      },
    });
  }
}
