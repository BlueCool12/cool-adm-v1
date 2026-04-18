import { extname, join } from 'path';
import { FileUploader } from '@/media/application/file-uploader';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaType } from '@/media/domain/media-type.enum';

@Injectable()
export class LocalFileUploader extends FileUploader {
  private readonly ROOT_DIR: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.ROOT_DIR = this.configService.getOrThrow<string>('UPLOAD_ROOT_DIR');
  }

  async upload(file: Express.Multer.File, type: MediaType): Promise<string> {
    try {
      const subPath = `${type.toLowerCase()}s/${this.generateDateBasedPath()}`;
      const uploadDirPath = join(this.ROOT_DIR, subPath);

      if (!fs.existsSync(uploadDirPath)) {
        fs.mkdirSync(uploadDirPath, { recursive: true });
      }

      const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
      const fullPath = join(uploadDirPath, uniqueFileName);

      await fs.promises.writeFile(fullPath, file.buffer);

      return `${subPath}/${uniqueFileName}`;
    } catch {
      throw new InternalServerErrorException('파일 업로드 중 오류가 발생했습니다.');
    }
  }

  private generateDateBasedPath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    return `${year}/${month}`;
  }
}
