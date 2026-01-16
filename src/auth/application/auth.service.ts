import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserRepository } from '@/user/application/user.repository';
import * as bcrypt from 'bcrypt';
import { AuthDomainError } from '@/auth/domain/auth-credential';
import { UserRole } from '@/user/domain/user-role.enum';
import { LoginResult } from '@/auth/application/result/login.result';
import { ConfigService } from '@nestjs/config';
import { AuthUserResult } from '@/user/application/result/auth-user.result';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginId: string, password: string) {
    const credential = await this.userRepository.findByLoginId(loginId);
    if (!credential) throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');

    try {
      await credential.authenticate(password, async (raw, hashed) => {
        return await bcrypt.compare(raw, hashed);
      });

      const snapshot = credential.getSnapshot();
      await this.userRepository.saveAuthStatus(snapshot);

      const userProfile = await this.userRepository.findById(snapshot.id);
      if (!userProfile) throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');

      const [accessToken, refreshToken] = await Promise.all([
        this.signAccessToken({ id: snapshot.id, role: snapshot.role }),
        this.signRefreshToken({ id: snapshot.id }),
      ]);

      await this.setRefreshToken(snapshot.id, refreshToken);

      return new LoginResult(
        accessToken,
        refreshToken,
        new AuthUserResult(
          snapshot.id,
          snapshot.loginId,
          userProfile.getName(),
          userProfile.getNickname(),
          userProfile.getProfileImageUrl(),
          snapshot.role,
        ),
      );
    } catch (error) {
      if (credential) await this.userRepository.saveAuthStatus(credential.getSnapshot());

      if (error instanceof AuthDomainError) {
        if (error.type === 'LOCKED') throw new ForbiddenException(error.message);
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  async findMe(id: string): Promise<AuthUserResult> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');

    return {
      id: user.id,
      loginId: user.getLoginId(),
      name: user.getName(),
      nickname: user.getNickname(),
      profileImageUrl: user.getProfileImageUrl(),
      role: user.getRole(),
    };
  }

  async refresh(
    id: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    const user = await this.userRepository.findById(id);
    const refreshTokenHash = user?.refreshTokenHash;

    if (!user || !refreshTokenHash) {
      throw new UnauthorizedException('유효하지 않은 인증 정보입니다.');
    }

    const isOk = await bcrypt.compare(refreshToken, refreshTokenHash);
    if (!isOk) throw new UnauthorizedException('인증 정보가 일치하지 않습니다.');

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken({ id: user.id, role: user.getRole() }),
      this.signRefreshToken({ id: user.id }),
    ]);

    await this.setRefreshToken(user.id, newRefreshToken);
    return { accessToken, newRefreshToken };
  }

  async logout(id: string): Promise<void> {
    await this.userRepository.updateRefreshToken(id, null);
  }

  private async signAccessToken(user: { id: string; role: UserRole }) {
    const secret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_TTL') ?? '15m';

    return this.jwtService.signAsync(
      { sub: String(user.id), role: user.role },
      { secret, expiresIn: expiresIn as JwtSignOptions['expiresIn'] },
    );
  }

  private async signRefreshToken(user: { id: string }) {
    const secret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_TTL') ?? '7d';

    return this.jwtService.signAsync(
      { sub: String(user.id) },
      { secret, expiresIn: expiresIn as JwtSignOptions['expiresIn'] },
    );
  }

  private async setRefreshToken(id: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 12);
    await this.userRepository.updateRefreshToken(id, hash);
  }
}
