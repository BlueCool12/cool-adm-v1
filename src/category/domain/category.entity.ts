import { LiteEntity } from '@/common/entity/base.entity';
import { Slug } from '@/common/vo/slug.vo';
import { Column, Entity } from 'typeorm';

@Entity('category')
export class Category extends LiteEntity {
  private static readonly MAX_NAME_LENGTH = 20;
  private static readonly MAX_SLUG_LENGTH = 20;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  public parentId: number | null;

  @Column({ length: 20 })
  private name: string;

  @Column({ length: 20, unique: true })
  private slug: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  public sortOrder: number;

  private constructor() {
    super();
  }

  public static create(
    name: string,
    slugInput: string,
    parentId: number | null = null,
    sortOrder: number = 0,
  ): Category {
    const category = new Category();

    category.validateName(name);
    const validatedSlug = new Slug(slugInput, Category.MAX_SLUG_LENGTH);

    category.name = name;
    category.slug = validatedSlug.getValue();
    category.parentId = parentId;
    category.sortOrder = sortOrder;

    return category;
  }

  // behavior
  public update(name: string, slug: string, parentId: number | null): void {
    this.validateName(name);
    const validatedSlug = new Slug(slug, Category.MAX_SLUG_LENGTH);

    if (parentId === this.id) throw new Error('자기 자신을 상위 카테고리로 설정할 수 없습니다.');

    this.name = name;
    this.slug = validatedSlug.getValue();
    this.parentId = parentId;
  }

  public changeSortOrder(newOrder: number): void {
    this.sortOrder = newOrder;
  }

  // validation
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('카테고리 이름은 필수입니다.');
    if (name.length > Category.MAX_NAME_LENGTH)
      throw new Error(`이름은 ${Category.MAX_NAME_LENGTH}자를 초과할 수 없습니다.`);
  }

  // getter
  public getName(): string {
    return this.name;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getSortOrder(): number {
    return this.sortOrder;
  }
}
