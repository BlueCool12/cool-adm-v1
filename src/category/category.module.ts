import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/category/domain/category.entity';
import { CategoryRepository } from '@/category/application/category.repository';
import { TypeOrmCategoryRepository } from '@/category/infrastructure/typeorm-category.repository';
import { CategoryService } from '@/category/application/category.service';
import { CategoryController } from '@/category/presentation/category.controller';
import { PostModule } from '@/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), PostModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: TypeOrmCategoryRepository,
    },
  ],
})
export class CategoryModule {}
