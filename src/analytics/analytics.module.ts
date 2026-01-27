import { Comment } from '@/comment/domain/comment.entity';
import { PageView } from './domain/page-view.entity';
import { Post } from '@/post/domain/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from '@/analytics/presentation/analytics.controller';
import { AnalyticsService } from '@/analytics/application/analytics.service';
import { AnalyticsRepository } from '@/analytics/application/analytics.repository';
import { TypeOrmAnalyticsRepository } from '@/analytics/infrastructure/typeorm-analytics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PageView, Post, Comment])],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    {
      provide: AnalyticsRepository,
      useClass: TypeOrmAnalyticsRepository,
    },
  ],
})
export class AnalyticsModule {}
