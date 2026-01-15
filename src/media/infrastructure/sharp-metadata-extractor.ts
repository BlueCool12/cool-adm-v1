import { Injectable } from '@nestjs/common';
import { MetadataExtractor } from '@/media/application/metadata-extractor';
import { MediaType } from '@/media/domain/media-type.enum';
import { MediaMetadata } from '@/media/types/media.types';
import sharp from 'sharp';

@Injectable()
export class SharpMetadataExtractor extends MetadataExtractor {
  async extract(file: Express.Multer.File, type: MediaType): Promise<MediaMetadata> {
    if (type === MediaType.IMAGE || type === MediaType.PROFILE) {
      try {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();

        const stats = await image.stats();
        const { r, g, b } = stats.dominant;
        const dominantColor = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;

        return {
          mimeType: file.mimetype,
          size: file.size,
          width: metadata.width || 0,
          height: metadata.height || 0,
          format: metadata.format,
          hasAlpha: metadata.hasAlpha || false,
          isAnimated: metadata.pages ? metadata.pages > 1 : false,
          dominantColor: dominantColor,
        };
      } catch (e) {
        console.warn('이미지 분석 실패:', e);
        return { mimeType: file.mimetype, size: file.size };
      }
    }

    return { mimeType: file.mimetype, size: file.size };
  }
}
