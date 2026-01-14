import { Category } from '@/category/domain/category.entity';

export abstract class CategoryRepository {
  abstract save(category: Category): Promise<Category>;

  abstract findById(id: number): Promise<Category | null>;

  abstract findBySlug(slug: string): Promise<Category | null>;

  abstract findAll(): Promise<Category[]>;

  abstract findMaxSortOrder(parentId: number | null): Promise<number>;

  abstract countChildren(parentId: number): Promise<number>;

  abstract delete(id: number): Promise<void>;
}
