import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '@/comment/application/comment.service';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { GetCommentsRequest } from '@/comment/presentation/request/get-comments.request';
import { GetCommentsResponse } from '@/comment/presentation/response/get-comments.response';
import { GetCommentsCommand } from '@/comment/application/command/get-comments.command';
import { CommentStatus } from '@/comment/domain/comment-status.enum';
import { UpdateCommentStatusCommand } from '@/comment/application/command/update-comment-status.command';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/user/domain/user-role.enum';
import { GetUser } from '@/user/presentation/decorators/get-user.decorator';
import { CurrentUserPayload } from '@/auth/presentation/types/auth-request.type';
import { CreateReplyRequest } from '@/comment/presentation/request/create-reply.request';
import { CreateReplyCommand } from '@/comment/application/command/create-reply.command';

@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(@Query() request: GetCommentsRequest): Promise<GetCommentsResponse> {
    const command = new GetCommentsCommand(request.page, request.limit);
    return await this.commentService.findAll(command);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: CommentStatus) {
    const command = new UpdateCommentStatusCommand(id, status);
    await this.commentService.updateStatus(command);
    return { success: true };
  }

  @Post(':id/reply')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createReply(
    @Param('id') id: string,
    @Body() request: CreateReplyRequest,
    @GetUser() admin: CurrentUserPayload,
  ) {
    const command = new CreateReplyCommand(id, request.content, admin.id);
    await this.commentService.createReply(command);
    return { success: true };
  }
}
