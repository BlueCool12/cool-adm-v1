import { UpdateCategoryCommand } from '@/category/application/command/update-category.command';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  public readonly slug: string;

  @IsNumber()
  @IsOptional()
  public readonly parentId: number | null;

  toCommand(id: number): UpdateCategoryCommand {
    return new UpdateCategoryCommand(id, this.name, this.slug, this.parentId ?? null);
  }
}
