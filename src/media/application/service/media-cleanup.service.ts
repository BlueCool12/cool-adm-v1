import { Injectable, Logger } from '@nestjs/common';
import { FileManager } from '@/media/application/file-manager';
import { MediaUsageRepository } from '@/media/application/media-usage.repository';

@Injectable()
export class MediaCleanupService {
  private readonly logger = new Logger(MediaCleanupService.name);

  constructor(
    private readonly fileManager: FileManager,
    private readonly mediaUsageRepository: MediaUsageRepository,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('🧹 미사용 이미지 정리 시작...');

    const storedFiles = await this.fileManager.listAllFiles();
    if (storedFiles.length === 0) return;

    const usedImages = await this.mediaUsageRepository.getAllUsedImageFilenames();

    let deletedCount = 0;
    const now = Date.now();
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

    for (const filename of storedFiles) {
      if (usedImages.has(filename)) continue;

      const metadata = await this.fileManager.getFileMetadata(filename);
      if (!metadata) continue;

      if (now - metadata.birthtimeMs < ONE_MONTH) continue;

      await this.fileManager.deleteFile(filename);
      deletedCount++;
    }

    this.logger.log(`✅ 정리 완료: ${deletedCount}개 삭제됨.`);
  }
}
