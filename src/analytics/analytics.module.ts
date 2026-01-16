import { Comment } from '@/comment/domain/comment.entity';
import { PageView } from './domain/page-view.entity';
import { Post } from '@/post/domain/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from '@/analytics/presentation/analytics.controller';
import { AnalyticsService } from '@/analytics/application/analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([PageView, Post, Comment])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
