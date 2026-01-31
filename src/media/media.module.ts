import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Media } from '@/media/domain/media.entity';
import { Post } from '@/post/domain/post.entity';
import { User } from '@/user/domain/user.entity';

import { MediaController } from '@/media/presentation/media.controller';
import { MediaCleanupScheduler } from '@/media/presentation/media-cleanup.scheduler';

import { MediaService } from '@/media/application/service/media.service';
import { MediaCleanupService } from '@/media/application/service/media-cleanup.service';

import { MediaRepository } from '@/media/application/media.repository';
import { MediaUsageRepository } from '@/media/application/media-usage.repository';
import { FileUploader } from '@/media/application/file-uploader';
import { FileManager } from '@/media/application/file-manager';
import { MetadataExtractor } from '@/media/application/metadata-extractor';

import { TypeOrmMediaRepository } from '@/media/infrastructure/typeorm-media.repository';
import { TypeOrmMediaUsageRepository } from '@/media/infrastructure/typeorm-media-usage.repository';
import { LocalFileUploader } from '@/media/infrastructure/local-file-uploader';
import { LocalFileManager } from '@/media/infrastructure/local-file-manager';
import { SharpMetadataExtractor } from '@/media/infrastructure/sharp-metadata-extractor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaCleanupService,
    MediaCleanupScheduler,
    { provide: MediaRepository, useClass: TypeOrmMediaRepository },
    { provide: MediaUsageRepository, useClass: TypeOrmMediaUsageRepository },
    { provide: FileUploader, useClass: LocalFileUploader },
    { provide: FileManager, useClass: LocalFileManager },
    { provide: MetadataExtractor, useClass: SharpMetadataExtractor },
  ],
  exports: [MediaService],
})
export class MediaModule {}
