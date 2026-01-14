import { Category } from '@/category/domain/category.entity';

export class GetCategoryTreeResult {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly parentId: number | null,
    readonly children: GetCategoryTreeResult[] = [],
  ) {}

  static fromEntity(category: Category): GetCategoryTreeResult {
    return new GetCategoryTreeResult(
      category.id,
      category.getName(),
      category.getSlug(),
      category.parentId,
    );
  }
}
