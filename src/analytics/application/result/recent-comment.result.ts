import { RecentCommentData } from '@/analytics/domain/types/analytics.types';

export class RecentCommentResult {
  id!: string;
  nickname!: string;
  content!: string;
  createdAt!: Date;

  static from(data: RecentCommentData): RecentCommentResult {
    const result = new RecentCommentResult();
    result.id = data.id;
    result.nickname = data.nickname;
    result.content = data.content;
    result.createdAt = data.createdAt;
    return result;
  }
}
