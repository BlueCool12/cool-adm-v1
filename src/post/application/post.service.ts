import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '@/post/domain/post.entity';
import { PostRepository } from '@/post/application/post.repository';
import { CreatePostResult } from '@/post/application/result/create-post.result';
import { GetPostResult } from '@/post/application/result/get-post.result';
import { UpdatePostCommand } from '@/post/application/command/update-post.command';
import { MediaService } from '@/media/application/media.service';
import { GetPostsResult } from '@/post/application/result/get-posts.result';
import { GetPostsQuery } from './query/get-posts.query';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createDraft(): Promise<CreatePostResult> {
    const post = Post.createDraft();
    const savedPost = await this.postRepository.save(post);
    return CreatePostResult.fromEntity(savedPost);
  }

  async getPost(id: string): Promise<GetPostResult> {
    const post = await this.getById(id);
    return GetPostResult.fromEntity(post);
  }

  async getPosts(query: GetPostsQuery) {
    const { search, page, limit, status, categoryId, startDate, endDate } = query;

    const [entities, total] = await this.postRepository.findAll({
      search,
      status,
      categoryId,
      startDate,
      endDate,
      skip: (page - 1) * limit,
      take: limit,
    });

    return GetPostsResult.fromEntities(entities, total, page, limit);
  }

  async updatePost(command: UpdatePostCommand): Promise<GetPostResult> {
    const { id, title, content, contentJson, slug, description, categoryId, status } =
      command.props;
    const post = await this.getById(id);

    if (post.medias) {
      await this.mediaService.syncMediaUsage(post.medias, content);
    }

    post.updateDetails({
      title: title,
      content: content,
      contentJson: contentJson,
      slug: slug,
      description: description,
      categoryId: categoryId,
    });

    post.changeStatus(status);

    const savedPost = await this.postRepository.save(post);
    return GetPostResult.fromEntity(savedPost);
  }

  async deletePost(id: string): Promise<void> {
    await this.getById(id);
    await this.postRepository.delete(id);
  }

  async countByCategoryId(categoryId: number): Promise<number> {
    return await this.postRepository.countByCategoryId(categoryId);
  }

  private async getById(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`해당 ID(${id})의 게시글을 찾을 수 없습니다.`);
    return post;
  }
}
