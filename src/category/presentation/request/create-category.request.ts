import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateCategoryCommand } from '@/category/application/command/create-category.command';

export class CreateCategoryRequest {
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
  public readonly parentId?: number | null;

  toCommand(): CreateCategoryCommand {
    return new CreateCategoryCommand(this.name, this.slug, this.parentId ?? null);
  }
}
