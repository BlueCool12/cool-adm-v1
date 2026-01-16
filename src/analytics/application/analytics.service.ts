import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PageView } from '@/analytics/domain/page-view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/post/domain/post.entity';
import { Comment } from '@/comment/domain/comment.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getDashboardStats() {
    const [todayPv, todayUv, pendingComments, totalPosts, weeklyTopPosts] = await Promise.all([
      this.getTodayPv(),
      this.getTodayUv(),
      this.getPendingCommentCount(),
      this.postRepository.count(),
      this.getWeeklyTopPosts(),
    ]);

    const trend = await this.getDailyTrend();
    const recentComments = await this.getRecentComments();

    return {
      summary: {
        todayPv,
        todayUv,
        pendingComments,
        totalPosts,
      },
      trend,
      recentComments,
      weeklyTopPosts,
    };
  }

  private async getTodayPv(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.pageViewRepository.count({
      where: { createdAt: MoreThanOrEqual(today) },
    });
  }

  private async getTodayUv(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.ip_address)', 'count')
      .where('pv.created_at >= :today', { today })
      .getRawOne<{ count: string }>();

    return parseInt(result?.count || '0', 10);
  }

  private async getPendingCommentCount(): Promise<number> {
    return this.commentRepository
      .createQueryBuilder('c')
      .where('c.adminId IS NULL')
      .leftJoin(Comment, 'reply', 'reply.parentId = c.id AND reply.adminId IS NOT NULL')
      .andWhere('reply.id IS NULL')
      .getCount();
  }

  private async getDailyTrend() {
    const rawData = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select("TO_CHAR(pv.created_at, 'MM/DD')", 'day')
      .addSelect('COUNT(*)', 'pv')
      .addSelect('COUNT(DISTINCT pv.ip_address)', 'uv')
      .where("pv.created_at >= NOW() - INTERVAL '6 days'")
      .groupBy("TO_CHAR(pv.created_at, 'MM/DD')")
      .orderBy('day', 'ASC')
      .getRawMany<{ day: string; pv: string; uv: string }>();

    const result: { day: string; pv: number; uv: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateStr = `${month}/${day}`;

      const found = rawData.find((raw) => raw.day === dateStr);

      result.push({
        day: dateStr,
        pv: found ? parseInt(found.pv, 10) : 0,
        uv: found ? parseInt(found.uv, 10) : 0,
      });
    }

    return result;
  }

  private async getRecentComments() {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.adminId IS NULL')
      .select('comment.id', 'id')
      .addSelect('comment.nickname', 'nickname')
      .addSelect('comment.content', 'content')
      .addSelect('comment.createdAt', 'createdAt')
      .orderBy('comment.createdAt', 'DESC')
      .take(4)
      .getRawMany();
  }

  private async getWeeklyTopPosts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.pageViewRepository
      .createQueryBuilder('pv')
      .innerJoin(Post, 'p', 'pv.slug = p.slug')
      .select('p.id', 'id')
      .addSelect('p.title', 'title')
      .addSelect('p.slug', 'slug')
      .addSelect('COUNT(pv.id)', 'viewCount')
      .where('pv.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy('p.id')
      .addGroupBy('p.title')
      .addGroupBy('p.slug')
      .orderBy('"viewCount"', 'DESC')
      .limit(3)
      .getRawMany();
  }
}
