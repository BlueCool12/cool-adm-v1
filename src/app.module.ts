import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { HealthModule } from '@/health/health.module';
import { AuthModule } from '@/auth/auth.module';
import { MediaModule } from '@/media/media.module';

import { CategoryModule } from '@/category/category.module';
import { PostModule } from '@/post/post.module';
import { CommentModule } from '@/comment/comment.module';

import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),
    HealthModule,
    AuthModule,
    UserModule,
    PostModule,
    MediaModule,
    CategoryModule,
    CommentModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
