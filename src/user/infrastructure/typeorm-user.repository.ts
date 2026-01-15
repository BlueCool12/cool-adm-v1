import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/domain/user.entity';
import { UserRole } from '@/user/domain/user-role.enum';
import { AuthCredential } from '@/auth/domain/auth-credential';
import { UserRepository } from '@/user/application/user.repository';

export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async saveAuthStatus(snapshot: ReturnType<AuthCredential['getSnapshot']>): Promise<void> {
    await this.userRepository.update(snapshot.id, {
      failedAttempts: snapshot.failedAttempts,
      lockedUntil: snapshot.lockedUntil,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByLoginId(loginId: string): Promise<AuthCredential | null> {
    const user = await this.userRepository.findOne({
      where: {
        ['loginId' as keyof User]: loginId,
      },
    });
    if (!user) return null;

    const snapshot = user.getSnapshot();
    return AuthCredential.restore(snapshot);
  }

  async findAll(options: {
    skip: number;
    take: number;
    role?: UserRole;
    search?: string;
  }): Promise<[User[], number]> {
    const query = this.userRepository.createQueryBuilder('user');

    if (options.role) query.andWhere('user.role = :role', { role: options.role });

    if (options.search) {
      query.andWhere(
        '(user.login_id LIKE :search OR user.name LIKE :search OR user.nickname LIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    return await query
      .skip(options.skip)
      .take(options.take)
      .orderBy('user.lastLoginAt', 'DESC')
      .getManyAndCount();
  }

  async updateRefreshToken(userId: string, hash: string | null): Promise<void> {
    await this.userRepository.update(userId, {
      refreshTokenHash: hash,
    });
  }

  async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
