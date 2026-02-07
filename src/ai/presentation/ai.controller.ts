import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from '@/ai/application/ai.service';
import { ChatRequest } from '@/ai/presentation/request/chat.request';
import { ChatResponse } from '@/ai/presentation/response/chat.response';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('chat')
  async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    const reply = await this.aiService.chat(request.message);
    return new ChatResponse(reply);
  }
}
