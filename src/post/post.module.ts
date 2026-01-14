import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/post/domain/post.entity';
import { PostService } from '@/post/application/post.service';
import { PostRepository } from '@/post/application/post.repository';
import { TypeOrmPostRepository } from '@/post/infrastructure/typeorm-post.repository';
import { PostController } from '@/post/presentation/post.controller';
import { MediaModule } from '@/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), MediaModule],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: PostRepository,
      useClass: TypeOrmPostRepository,
    },
  ],
  exports: [PostService],
})
export class PostModule {}
