import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { PageView } from '@/analytics/domain/page-view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsRepository } from '@/analytics/application/analytics.repository';
import { Post } from '@/post/domain/post.entity';
import { Comment } from '@/comment/domain/comment.entity';
import {
  DailyVisitData,
  MostViewedPostData,
  PostPerformanceData,
  ReferrerData,
} from '@/analytics/domain/types/analytics.types';

@Injectable()
export class TypeOrmAnalyticsRepository extends AnalyticsRepository {
  constructor(
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super();
  }

  async getPvCount(start: Date, end: Date): Promise<number> {
    return this.pageViewRepository.count({ where: { createdAt: Between(start, end) } });
  }

  async getUvCount(start: Date, end: Date): Promise<number> {
    const result = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.ip_address)', 'count')
      .where('pv.created_at BETWEEN :start AND :end', { start, end })
      .getRawOne<{ count: string }>();

    return parseInt(result?.count || '0', 10);
  }

  async getBounceRateStats(start: Date, end: Date): Promise<{ total: number; bounced: number }> {
    const query = this.pageViewRepository
      .createQueryBuilder('pv')
      .select('pv.ip_address')
      .where('pv.created_at BETWEEN :start AND :end', { start, end })
      .groupBy('pv.ip_address');

    const total = await query.getCount();

    let bounced = 0;
    if (total > 0) {
      bounced = await query.having('COUNT(pv.id) = 1').getCount();
    }

    return { total, bounced };
  }

  async getAvgDurationSeconds(start: Date, end: Date): Promise<number> {
    interface AvgDurationResult {
      avg_duration: string | null;
    }

    const result = await this.pageViewRepository.query<AvgDurationResult[]>(
      `
            SELECT AVG(EXTRACT(EPOCH FROM (max_time - min_time))) as avg_duration
            FROM (
              SELECT MAX(created_at) as max_time, MIN(created_at) as min_time
              FROM page_view
              WHERE created_at BETWEEN $1 AND $2
              GROUP BY ip_address
              HAVING COUNT(*) > 1
            ) sub
          `,
      [start, end],
    );

    const durationStr = result[0]?.avg_duration;
    return parseFloat(durationStr || '0');
  }

  async getTrafficRawData(start: Date): Promise<DailyVisitData[]> {
    return this.pageViewRepository
      .createQueryBuilder('pv')
      .select("TO_CHAR(pv.created_at, 'MM/DD')", 'date')
      .addSelect('COUNT(pv.id)', 'pv')
      .addSelect('COUNT(DISTINCT pv.ip_address)', 'uv')
      .where('pv.created_at >= :start', { start })
      .groupBy("TO_CHAR(pv.created_at, 'MM/DD')")
      .orderBy('date', 'ASC')
      .getRawMany<DailyVisitData>();
  }

  async getMostViewedPosts(dateLimit: Date, limit: number): Promise<MostViewedPostData[]> {
    return this.pageViewRepository
      .createQueryBuilder('pv')
      .innerJoin(Post, 'p', 'pv.slug = p.slug')
      .select(['p.id AS id', 'p.title AS title', 'COUNT(pv.id) AS views'])
      .where('pv.created_at >= :dateLimit', { dateLimit })
      .groupBy('p.id')
      .orderBy('views', 'DESC')
      .limit(limit)
      .getRawMany<MostViewedPostData>();
  }

  async getPostPerformance(
    page: number,
    limit: number,
  ): Promise<{ data: PostPerformanceData[]; total: number }> {
    const total = await this.postRepository.count();

    const data = await this.postRepository
      .createQueryBuilder('p')
      .leftJoin('page_view', 'pv', 'p.slug = pv.slug')
      .select([
        'p.id AS id',
        'p.title AS title',
        'p.slug AS slug',
        'p.publishedAt AS "publishedAt"',
      ])
      .addSelect('COUNT(pv.id)', 'views')
      .addSelect('COUNT(DISTINCT pv.ip_address)', 'uv')
      .groupBy('p.id')
      .addGroupBy('p.title')
      .addGroupBy('p.slug')
      .addGroupBy('p.publishedAt')
      .orderBy('"views"', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<PostPerformanceData>();

    return { data, total };
  }

  async getReferrerStats(): Promise<ReferrerData[]> {
    return this.pageViewRepository
      .createQueryBuilder('pv')
      .select(
        `CASE
          WHEN pv.referrer LIKE '%google%' THEN 'Google'
          WHEN pv.referrer LIKE '%naver%' THEN 'Naver'
          WHEN pv.referrer LIKE '%daum%' THEN 'Daum'
          WHEN pv.referrer LIKE '%facebook%' OR pv.referrer LIKE '%instagram%' THEN 'Social'
          WHEN pv.referrer IS NULL OR pv.referrer = '' THEN 'Direct'
          ELSE 'Others'
        END`,
        'label',
      )
      .addSelect('COUNT(*)', 'value')
      .groupBy('"label"')
      .orderBy('"value"', 'DESC')
      .getRawMany<ReferrerData>();
  }

  async getDeviceStats(): Promise<ReferrerData[]> {
    return this.pageViewRepository
      .createQueryBuilder('pv')
      .select(
        `CASE
          WHEN pv.userAgent LIKE '%Mobile%' OR pv.userAgent LIKE '%Android%' OR pv.userAgent LIKE '%iPhone%' THEN 'Mobile'
          WHEN pv.userAgent LIKE '%Tablet%' OR pv.userAgent LIKE '%iPad%' THEN 'Tablet'
          ELSE 'Desktop'
        END`,
        'label',
      )
      .addSelect('COUNT(*)', 'value')
      .groupBy('"label"')
      .orderBy('"value"', 'DESC')
      .getRawMany<ReferrerData>();
  }

  async getPendingCommentCount(): Promise<number> {
    return this.commentRepository
      .createQueryBuilder('c')
      .where('c.adminId IS NULL')
      .leftJoin(Comment, 'reply', 'reply.parentId = c.id AND reply.adminId IS NOT NULL')
      .andWhere('reply.id IS NULL')
      .getCount();
  }

  async getRecentComments(): Promise<any[]> {
    return this.commentRepository
      .createQueryBuilder('c')
      .where('c.adminId IS NULL')
      .select([
        'c.id AS id',
        'c.nickname AS nickname',
        'c.content AS content',
        'c.createdAt AS createdAt',
      ])
      .orderBy('c.createdAt', 'DESC')
      .take(4)
      .getRawMany();
  }

  async getTotalPostCount(): Promise<number> {
    return this.postRepository.count();
  }
}
