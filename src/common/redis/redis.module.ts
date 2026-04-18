import { DynamicModule, Global, Logger, Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from '@/common/redis/redis.service';

@Global()
@Module({})
export class RedisModule implements OnModuleDestroy {
  private static readonly logger = new Logger(RedisModule.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
    RedisModule.logger.log('Redis connection closed');
  }

  static register(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: (configService: ConfigService) => {
            const client = new Redis({
              host: configService.getOrThrow<string>('REDIS_HOST'),
              port: configService.getOrThrow<number>('REDIS_PORT'),
              password: configService.getOrThrow<string>('REDIS_PASSWORD'),
            });
            client.on('error', (err) =>
              RedisModule.logger.error('Redis connection error', err.stack),
            );
            return client;
          },
          inject: [ConfigService],
        },
        RedisService,
      ],
      exports: ['REDIS_CLIENT', RedisService],
    };
  }
}
