import {
  Injectable,
  InternalServerErrorException,
  Inject,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { AiTaskStatus } from '@/ai/domain/ai-task-status.enum';
import { AiTaskResult } from '@/ai/domain/ai-task-result.interface';
import { RedisService } from '@/common/redis/redis.service';
import { IndexPostCommand } from '@/ai/application/command/index-post.command';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly TASK_TTL = 3600;

  constructor(
    @Inject('AI_CLIENT') private readonly aiClient: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  async getJobStatus(jobId: string): Promise<AiTaskResult> {
    const task = await this.redisService.get<AiTaskResult>(`ai_task:${jobId}`);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async chat(message: string): Promise<{ jobId: string }> {
    return this.createJob('chat', { message });
  }

  async suggestTopic(): Promise<{ jobId: string }> {
    return this.createJob('suggest_topic', {});
  }

  async suggestSlug(title: string): Promise<{ jobId: string }> {
    return this.createJob('suggest_slug', { title });
  }

  async suggestSummary(content: string): Promise<{ jobId: string }> {
    return this.createJob('suggest_summary', { content });
  }

  async generateImage(content: string): Promise<{ jobId: string }> {
    return this.createJob('generate_image', { content });
  }

  async indexPost(params: IndexPostCommand): Promise<{ jobId: string }> {
    return this.createJob('index_post', {
      id: params.id,
      title: params.title,
      slug: params.slug,
      description: params.description,
      content: params.content,
      category: params.category,
      published_at: params.publishedAt.toISOString(),
    });
  }

  async deletePostIndex(id: string): Promise<{ jobId: string }> {
    return this.createJob('delete_post_index', { id });
  }

  private async createJob(
    type: string,
    payload: Record<string, unknown>,
  ): Promise<{ jobId: string }> {
    try {
      const jobId = uuidv4();
      const initialTask: AiTaskResult = {
        status: AiTaskStatus.PENDING,
        createdAt: Date.now(),
      };

      await this.redisService.set(`ai_task:${jobId}`, initialTask, this.TASK_TTL);
      await firstValueFrom(this.aiClient.emit({ cmd: type }, { jobId, ...payload }));

      return { jobId };
    } catch (error) {
      this.logger.error(
        `Failed to create ${type} job`,
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }
}
