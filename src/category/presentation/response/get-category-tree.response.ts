import { GetCategoryTreeResult } from '@/category/application/result/get-category-tree.result';

export class GetCategoryTreeResponse {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly parentId: number | null;
  readonly children: GetCategoryTreeResponse[];

  constructor(result: GetCategoryTreeResult) {
    this.id = result.id;
    this.name = result.name;
    this.slug = result.slug;
    this.parentId = result.parentId;
    this.children = result.children?.map((child) => new GetCategoryTreeResponse(child)) || [];
  }
}
