import { RecentCommentResult } from '@/analytics/application/result/recent-comment.result';

export class RecentCommentResponse {
  id!: string;
  nickname!: string;
  content!: string;
  createdAt!: Date;

  static from(result: RecentCommentResult): RecentCommentResponse {
    const response = new RecentCommentResponse();
    response.id = result.id;
    response.nickname = result.nickname;
    response.content = result.content;
    response.createdAt = result.createdAt;
    return response;
  }
}
