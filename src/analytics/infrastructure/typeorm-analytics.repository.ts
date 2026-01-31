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
      .select('COUNT(DISTINCT pv.client_id)', 'count')
      .where('pv.created_at BETWEEN :start AND :end', { start, end })
      .andWhere('pv.client_id IS NOT NULL')
      .getRawOne<{ count: string }>();

    return parseInt(result?.count || '0', 10);
  }

  async getBounceRateStats(start: Date, end: Date): Promise<{ total: number; bounced: number }> {
    interface CountResult {
      count: string;
    }

    const totalResult = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.session_id)', 'count')
      .where('pv.created_at BETWEEN :start AND :end', { start, end })
      .andWhere('pv.session_id IS NOT NULL')
      .getRawOne<CountResult>();

    const total = parseInt(totalResult?.count || '0', 10);

    let bounced = 0;
    if (total > 0) {
      const bouncedResult = await this.pageViewRepository.query<CountResult[]>(
        `SELECT COUNT(*) as count
          FROM (
            SELECT session_id
            FROM page_view
            WHERE created_at BETWEEN $1 AND $2
              AND session_id IS NOT NULL
            GROUP BY session_id
            HAVING COUNT(*) = 1
         ) as sub`,
        [start, end],
      );

      bounced = parseInt(bouncedResult[0]?.count || '0', 10);
    }

    return { total, bounced };
  }

  async getAvgDurationSeconds(start: Date, end: Date): Promise<number> {
    interface AvgDurationResult {
      avg_duration: string | null;
    }

    const result = await this.pageViewRepository.query<AvgDurationResult[]>(
      `SELECT AVG(EXTRACT(EPOCH FROM (max_time - min_time))) as avg_duration
        FROM (
          SELECT MAX(created_at) as max_time, MIN(created_at) as min_time
          FROM page_view
          WHERE created_at BETWEEN $1 AND $2
          GROUP BY session_id
          HAVING COUNT(*) > 1
        ) sub`,
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
      .addSelect('COUNT(DISTINCT pv.client_id)', 'uv')
      .where('pv.created_at >= :start', { start })
      .andWhere('pv.client_id IS NOT NULL')
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
      .addSelect('COUNT(DISTINCT pv.client_id)', 'uv')
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
          WHEN pv.referrer LIKE '%github%' THEN 'GitHub'
          WHEN pv.referrer LIKE '%okky%' THEN 'OKKY'
          WHEN pv.referrer LIKE '%jobkorea%' THEN 'JobKorea'
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
      .select('INITCAP(pv.device_type)', 'label')
      .addSelect('COUNT(*)', 'value')
      .where("pv.device_type != 'bot'")
      .groupBy('pv.device_type')
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
