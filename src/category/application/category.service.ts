import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Category } from '@/category/domain/category.entity';
import { CategoryRepository } from '@/category/application/category.repository';

import { CreateCategoryCommand } from '@/category/application/command/create-category.command';
import { UpdateCategoryCommand } from '@/category/application/command/update-category.command';
import { CreateCategoryResult } from '@/category/application/result/create-category.result';
import { GetCategoryTreeResult } from '@/category/application/result/get-category-tree.result';

import { PostService } from '@/post/application/post.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly postService: PostService,
  ) {}

  async create(command: CreateCategoryCommand): Promise<CreateCategoryResult> {
    await this.validateDuplicatedSlug(command.slug);

    if (command.parentId) {
      await this.getById(command.parentId);
    }

    const maxOrder = await this.categoryRepository.findMaxSortOrder(command.parentId);

    const category = Category.create(command.name, command.slug, command.parentId, maxOrder + 1);

    const savedCategory = await this.categoryRepository.save(category);
    return new CreateCategoryResult(savedCategory.id, savedCategory.getSlug());
  }

  async findAllTree(): Promise<GetCategoryTreeResult[]> {
    const allCategories = await this.categoryRepository.findAll();

    const map = new Map<number, GetCategoryTreeResult>();
    allCategories.forEach((category) => {
      map.set(category.id, GetCategoryTreeResult.fromEntity(category));
    });

    const roots: GetCategoryTreeResult[] = [];

    allCategories.forEach((category) => {
      const currentItem = map.get(category.id)!;

      if (category.parentId && map.has(category.parentId)) {
        const parentItem = map.get(category.parentId)!;
        parentItem.children.push(currentItem);
      } else {
        roots.push(currentItem);
      }
    });

    return roots;
  }

  async update(command: UpdateCategoryCommand): Promise<void> {
    const category = await this.getById(command.id);

    if (category.getSlug() !== command.slug) {
      const existing = await this.categoryRepository.findBySlug(command.slug);
      if (existing) throw new ConflictException('이미 사용 중인 슬러그입니다.');
    }

    let targetSortOrder = category.getSortOrder();

    if (category.parentId !== command.parentId) {
      if (command.parentId) {
        await this.getById(command.parentId);
      }

      const maxOrder = await this.categoryRepository.findMaxSortOrder(command.parentId);
      targetSortOrder = maxOrder + 1;
    }

    category.update(command.name, command.slug, command.parentId);
    category.changeSortOrder(targetSortOrder);

    await this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);

    const childrenCount = await this.categoryRepository.countChildren(id);
    if (childrenCount > 0) {
      throw new BadRequestException('하위 카테고리가 존재하여 삭제할 수 없습니다.');
    }

    const postCount = await this.postService.countByCategoryId(id);
    if (postCount > 0) {
      throw new BadRequestException('해당 카테고리에 작성된 포스트가 있어 삭제할 수 없습니다.');
    }

    await this.categoryRepository.delete(id);
  }

  private async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException(`해당 ID(${id})의 카테고리를 찾을 수 없습니다.`);
    return category;
  }

  private async validateDuplicatedSlug(slug: string): Promise<void> {
    const existing = await this.categoryRepository.findBySlug(slug);
    if (existing) throw new ConflictException('이미 사용 중인 슬러그입니다.');
  }
}
