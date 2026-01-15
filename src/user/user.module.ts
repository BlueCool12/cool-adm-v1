import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/domain/user.entity';
import { UserRepository } from '@/user/application/user.repository';
import { TypeOrmUserRepository } from '@/user/infrastructure/typeorm-user.repository';
import { UserService } from '@/user/application/user.service';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
