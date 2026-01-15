import { MediaType } from '@/media/domain/media-type.enum';

export class UploadFileCommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly type: MediaType,
    public readonly postId?: string,
  ) {}
}
