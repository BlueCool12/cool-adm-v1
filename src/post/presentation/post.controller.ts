import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '@/post/application/post.service';
import { CreatePostResponse } from '@/post/presentation/response/create-post.response';
import { GetPostResponse } from '@/post/presentation/response/get-post.response';
import { UpdatePostCommand } from '@/post/application/command/update-post.command';
import { UpdatePostRequest } from '@/post/presentation/request/update-post.request';
import { GetPostListResponse } from '@/post/presentation/response/get-post-list.response';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/user/domain/user-role.enum';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { GetPostsRequest } from './request/get-posts.request';
import { GetPostsQuery } from '../application/query/get-posts.query';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createDraft(): Promise<CreatePostResponse> {
    const result = await this.postService.createDraft();
    return CreatePostResponse.fromResult(result);
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<GetPostResponse> {
    const result = await this.postService.getPost(id);
    return GetPostResponse.fromResult(result);
  }

  @Get()
  async getPosts(@Query() request: GetPostsRequest): Promise<GetPostListResponse> {
    const query = new GetPostsQuery({ ...request, categoryId: request.category });
    const result = await this.postService.getPosts(query);

    return GetPostListResponse.fromResult(result);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updatePost(
    @Param('id') id: string,
    @Body() request: UpdatePostRequest,
  ): Promise<GetPostResponse> {
    const command = new UpdatePostCommand({ id, ...request });
    const result = await this.postService.updatePost(command);
    return GetPostResponse.fromResult(result);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
  }
}
