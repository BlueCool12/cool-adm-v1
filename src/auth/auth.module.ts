import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '@/auth/presentation/strategies/jwt.strategy';
import { RefreshStrategy } from '@/auth/presentation/strategies/refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@/auth/presentation/auth.controller';
import { AuthService } from '@/auth/application/auth.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
