import { Column, Entity } from 'typeorm';
import { UserRole } from './user-role.enum';
import { CoreEntity } from '@/common/entity/base.entity';

@Entity('user')
export class User extends CoreEntity {
  @Column({ name: 'login_id', unique: true, length: 255 })
  public readonly loginId: string;

  @Column({ name: 'password_hash', length: 60 })
  public readonly passwordHash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  private name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  private nickname: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  public readonly role: UserRole;

  @Column({ name: 'failed_attempts', default: 0 })
  public readonly failedAttempts: number;

  @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
  public readonly lockedUntil: Date | null;

  @Column({ type: 'varchar', name: 'refresh_token_hash', length: 255, nullable: true })
  public readonly refreshTokenHash: string | null;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  private lastLoginAt: Date | null;

  // getter
  public getName(): string | null {
    return this.name;
  }

  public getNickname(): string | null {
    return this.nickname;
  }
}
