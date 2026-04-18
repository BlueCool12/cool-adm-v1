import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserRole } from '@/user/domain/user-role.enum';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { ChatRequest } from '@/ai/presentation/request/chat.request';
import { SuggestSlugRequest } from '@/ai/presentation/request/suggest-slug.request';
import { SuggestSummaryRequest } from '@/ai/presentation/request/suggest-summary.request';
import { GenerateImageRequest } from '@/ai/presentation/request/generate-image.request';
import { AiJobResponse } from '@/ai/presentation/response/ai-job.response';
import { GetJobStatusResponse } from '@/ai/presentation/response/get-job-status.response';
import { AiService } from '@/ai/application/ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @Roles(UserRole.ADMIN)
  async chat(@Body() request: ChatRequest): Promise<AiJobResponse> {
    const result = await this.aiService.chat(request.message);
    return AiJobResponse.from(result);
  }

  @Post('suggest/topic')
  @Roles(UserRole.ADMIN)
  async suggestTopic(): Promise<AiJobResponse> {
    const result = await this.aiService.suggestTopic();
    return AiJobResponse.from(result);
  }

  @Post('suggest/slug')
  @Roles(UserRole.ADMIN)
  async suggestSlug(@Body() request: SuggestSlugRequest): Promise<AiJobResponse> {
    const result = await this.aiService.suggestSlug(request.title);
    return AiJobResponse.from(result);
  }

  @Post('suggest/summary')
  @Roles(UserRole.ADMIN)
  async suggestSummary(@Body() request: SuggestSummaryRequest): Promise<AiJobResponse> {
    const result = await this.aiService.suggestSummary(request.content);
    return AiJobResponse.from(result);
  }

  @Post('generate/image')
  @Roles(UserRole.ADMIN)
  async generateImage(@Body() request: GenerateImageRequest): Promise<AiJobResponse> {
    const result = await this.aiService.generateImage(request.content);
    return AiJobResponse.from(result);
  }

  @Get('jobs/:jobId')
  @Roles(UserRole.ADMIN)
  async getJobStatus(@Param('jobId', ParseUUIDPipe) jobId: string): Promise<GetJobStatusResponse> {
    const task = await this.aiService.getJobStatus(jobId);
    return GetJobStatusResponse.from(task);
  }
}
