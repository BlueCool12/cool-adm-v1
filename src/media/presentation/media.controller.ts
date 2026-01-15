import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '@/media/application/media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from '@/media/application/command/upload-file.command';
import { UploadMediaResponse } from '@/media/presentation/response/upload-media.response';
import { MediaType } from '@/media/domain/media-type.enum';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/user/domain/user-role.enum';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body('postId') postId: string,
  ) {
    const command = new UploadFileCommand(file, MediaType.IMAGE, postId);
    const url = await this.mediaService.uploadFile(command);
    return UploadMediaResponse.from(url);
  }

  @Post('images/profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const command = new UploadFileCommand(file, MediaType.PROFILE);
    const url = await this.mediaService.uploadFile(command);
    return UploadMediaResponse.from(url);
  }
}
