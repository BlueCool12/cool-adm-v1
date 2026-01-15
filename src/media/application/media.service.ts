import { Injectable } from '@nestjs/common';
import { MediaRepository } from '@/media/application/media.repository';
import { FileUploader } from '@/media/application/file-uploader';
import { Media } from '@/media/domain/media.entity';
import { UploadFileCommand } from '@/media/application/command/upload-file.command';
import { MetadataExtractor } from '@/media/application/metadata-extractor';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly fileUploader: FileUploader,
    private readonly metadataExtractor: MetadataExtractor,
  ) {}

  async uploadFile(command: UploadFileCommand): Promise<string> {
    const { file, type, postId } = command;

    const [storedName, metadata] = await Promise.all([
      this.fileUploader.upload(file, type),
      this.metadataExtractor.extract(file, type),
    ]);

    const media = Media.create({
      type: type,
      storedName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      metadata: metadata,
      postId: postId,
    });

    await this.mediaRepository.save(media);

    media.updateUrl();
    return media.getUrl();
  }

  async syncMediaUsage(storedMedias: Media[], content: string): Promise<void> {
    const activeImageNames = this.extractImageNames(content);
    const imagesToDelete = storedMedias.filter((media) => {
      const isUsed = activeImageNames.some((activeName) =>
        media.getStoredName().includes(activeName),
      );
      return !isUsed;
    });

    if (imagesToDelete.length > 0) {
      await this.mediaRepository.remove(imagesToDelete);
    }
  }

  private extractImageNames(content: string): string[] {
    if (!content) return [];

    const regex = /src=".*?\/([^/"]+\.(jpg|jpeg|png|gif|webp))"/gi;
    const matches: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      matches.push(decodeURI(match[1]));
    }

    return [...new Set(matches)];
  }
}
