import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/domain/user.entity';
import { Repository } from 'typeorm';
import { AuthCredential } from '@/auth/domain/auth-credential';

export class TypeOrmUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByLoginId(loginId: string): Promise<AuthCredential | null> {
    const user = await this.userRepository.findOne({ where: { loginId: loginId } });
    if (!user) return null;

    return AuthCredential.restore(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async saveAuthStatus(snapshot: ReturnType<AuthCredential['getSnapshot']>): Promise<void> {
    await this.userRepository.update(snapshot.id, {
      failedAttempts: snapshot.failedAttempts,
      lockedUntil: snapshot.lockedUntil,
    });
  }

  async updateRefreshToken(userId: string, hash: string | null): Promise<void> {
    await this.userRepository.update(userId, {
      refreshTokenHash: hash,
    });
  }
}
