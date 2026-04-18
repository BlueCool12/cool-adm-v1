import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Post } from '@/post/domain/post.entity';
import { PostStatus } from '@/post/domain/post-status.enum';

import { RedisService } from '@/common/redis/redis.service';
import { MediaService } from '@/media/application/service/media.service';
import { AiService } from '@/ai/application/ai.service';
import { PostRepository } from '@/post/application/post.repository';
import { GetPostsQuery } from '@/post/application/query/get-posts.query';
import { UpdatePostCommand } from '@/post/application/command/update-post.command';
import { AutoSavePostCommand } from './command/auto-save-post.command';
import { CreatePostResult } from '@/post/application/result/create-post.result';
import { GetPostResult } from '@/post/application/result/get-post.result';
import { GetPostsResult } from '@/post/application/result/get-posts.result';
import { GetAutoSaveResult } from './result/get-auto-save.result';

@Injectable()
export class PostService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly postRepository: PostRepository,
    private readonly mediaService: MediaService,
    private readonly aiService: AiService,
    private readonly redisService: RedisService,
  ) {}

  private getAutoSaveKey(id: string): string {
    return `post:autosave:${id}`;
  }

  async autoSave(command: AutoSavePostCommand): Promise<void> {
    const { id, ...data } = command.props;
    await this.getById(id);

    const key = this.getAutoSaveKey(id);
    await this.redisService.set(key, { ...data, savedAt: new Date() }, 604800); // 7 days TTL
  }

  async getAutoSave(id: string): Promise<GetAutoSaveResult | null> {
    const key = this.getAutoSaveKey(id);
    const data = await this.redisService.get(key);
    return data ? GetAutoSaveResult.fromData(data) : null;
  }

  async clearAutoSave(id: string): Promise<void> {
    const key = this.getAutoSaveKey(id);
    await this.redisService.del(key);
  }

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
    const {
      id,
      title,
      content,
      contentJson,
      contentMarkdown,
      slug,
      description,
      categoryId,
      status,
    } = command.props;

    const savedPost = await this.dataSource.transaction(async (manager) => {
      const post = await this.getById(id);
      const previousStatus = post.getStatus();

      if (post.medias) {
        await this.mediaService.syncMediaUsage(post.medias, content, manager);
      }

      post.updateDetails({ title, content, contentJson, slug, description, categoryId });
      post.changeStatus(status);

      const saved = await this.postRepository.save(post, manager);
      return { saved, previousStatus };
    });

    const { saved: finalPost, previousStatus } = savedPost;
    await this.clearAutoSave(id);

    if (finalPost.getStatus() === PostStatus.PUBLISHED) {
      const freshPost = await this.getById(finalPost.id);
      const category = freshPost.getCategory();
      const publishedAt = freshPost.getPublishedAt();

      if (category && publishedAt) {
        await this.aiService.indexPost({
          id: freshPost.id,
          title: freshPost.getTitle(),
          slug: freshPost.getSlug() || '',
          description: freshPost.getDescription(),
          content: contentMarkdown,
          category: category.getName(),
          publishedAt: publishedAt,
        });
      }
    } else if (previousStatus === PostStatus.PUBLISHED) {
      await this.aiService.deletePostIndex(id);
    }

    return GetPostResult.fromEntity(finalPost);
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.getById(id);
    const status = post.getStatus();

    await this.postRepository.delete(id);
    await this.clearAutoSave(id);

    if (status === PostStatus.PUBLISHED) {
      await this.aiService.deletePostIndex(id);
    }
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
