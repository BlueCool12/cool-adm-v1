import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MediaCleanupService } from '@/media/application/service/media-cleanup.service';

@Injectable()
export class MediaCleanupScheduler {
  constructor(private readonly mediaCleanupService: MediaCleanupService) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM, {
    timeZone: 'Asia/Seoul',
  })
  async handleCron() {
    await this.mediaCleanupService.execute();
  }
}
