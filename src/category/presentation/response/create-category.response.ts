import { CreateCategoryResult } from '@/category/application/result/create-category.result';

export class CreateCategoryResponse {
  public readonly id: number;
  public readonly slug: string;

  constructor(result: CreateCategoryResult) {
    this.id = result.id;
    this.slug = result.slug;
  }
}
