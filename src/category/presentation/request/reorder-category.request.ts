import { ReorderCategoryCommand } from '@/category/application/command/reorder-category.command';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class ReorderCategoryRequest {
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  ids: number[];

  toCommand(): ReorderCategoryCommand {
    return new ReorderCategoryCommand(this.ids);
  }
}
