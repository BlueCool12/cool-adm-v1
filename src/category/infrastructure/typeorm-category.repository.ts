import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@/category/application/category.repository';
import { IsNull, Repository } from 'typeorm';
import { Category } from '@/category/domain/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmCategoryRepository extends CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super();
  }

  async save(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async findById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({
      ['slug' as keyof Category]: slug,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: {
        parentId: { direction: 'ASC', nulls: 'FIRST' },
        sortOrder: 'ASC',
        id: 'ASC',
      },
    });
  }

  async findMaxSortOrder(parentId: number | null): Promise<number> {
    const result = await this.categoryRepository.findOne({
      where: { parentId: parentId ?? IsNull() },
      order: { sortOrder: 'DESC' },
      select: ['sortOrder'],
    });

    return result ? result.sortOrder : -1;
  }

  async countChildren(parentId: number): Promise<number> {
    return await this.categoryRepository.count({
      where: { parentId: parentId },
    });
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
