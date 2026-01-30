import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '@/category/application/category.service';
import { CreateCategoryRequest } from '@/category/presentation/request/create-category.request';
import { CreateCategoryResponse } from '@/category/presentation/response/create-category.response';
import { GetCategoryTreeResponse } from '@/category/presentation/response/get-category-tree.response';
import { UpdateCategoryRequest } from '@/category/presentation/request/update-category.request';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/user/domain/user-role.enum';
import { ReorderCategoryRequest } from './request/reorder-category.request';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() request: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const command = request.toCommand();
    const result = await this.categoryService.create(command);
    return new CreateCategoryResponse(result);
  }

  @Get()
  async findAll(): Promise<GetCategoryTreeResponse[]> {
    const results = await this.categoryService.findAllTree();
    return results.map((result) => new GetCategoryTreeResponse(result));
  }

  @Patch('reorder')
  @Roles(UserRole.ADMIN)
  async reorder(@Body() request: ReorderCategoryRequest): Promise<{ success: boolean }> {
    const command = request.toCommand();
    await this.categoryService.reorder(command);
    return { success: true };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateCategoryRequest,
  ): Promise<{ success: boolean }> {
    const command = request.toCommand(id);
    await this.categoryService.update(command);
    return { success: true };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoryService.delete(id);
  }
}
