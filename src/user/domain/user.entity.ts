import { Column, Entity } from 'typeorm';
import { UserRole } from '@/user/domain/user-role.enum';
import { CoreEntity } from '@/common/entity/base.entity';

export interface UserSnapshot {
  id: string;
  loginId: string;
  passwordHash: string;
  failedAttempts: number;
  lockedUntil: Date | null;
  role: UserRole;
  lastLoginAt: Date | null;
}

@Entity('user')
export class User extends CoreEntity {
  @Column({ name: 'login_id', unique: true, length: 255 })
  private loginId!: string;

  @Column({ name: 'password_hash', length: 60 })
  private passwordHash!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  private name?: string | null = null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  private nickname?: string | null = null;

  @Column({ name: 'profile_image_url', type: 'varchar', length: 500, nullable: true })
  private profileImageUrl?: string | null = null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  private role!: UserRole;

  @Column({ name: 'failed_attempts', default: 0 })
  public readonly failedAttempts!: number;

  @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
  public readonly lockedUntil?: Date | null = null;

  @Column({ type: 'varchar', name: 'refresh_token_hash', length: 255, nullable: true })
  public readonly refreshTokenHash?: string | null = null;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  public readonly lastLoginAt?: Date | null = null;

  private constructor() {
    super();
  }

  public static create(params: {
    loginId: string;
    passwordHash: string;
    name: string;
    nickname: string;
    role: UserRole;
  }): User {
    const user = new User();

    user.loginId = params.loginId;
    user.passwordHash = params.passwordHash;
    user.name = params.name;
    user.nickname = params.nickname;
    user.role = params.role;

    return user;
  }

  // behavior
  public update(params: {
    name: string;
    nickname: string;
    role: UserRole;
    passwordHash?: string;
  }): void {
    this.name = params.name;
    this.nickname = params.nickname;
    this.role = params.role;

    if (params.passwordHash) this.passwordHash = params.passwordHash;
  }

  public updateProfile(params: { nickname: string; profileImageUrl?: string | null }): void {
    this.nickname = params.nickname;
    if (params.profileImageUrl !== undefined) this.profileImageUrl = params.profileImageUrl;
  }

  // getter
  public getLoginId(): string {
    return this.loginId;
  }

  public getName(): string | null {
    return this.name ?? null;
  }

  public getNickname(): string | null {
    return this.nickname ?? null;
  }

  public getProfileImageUrl(): string | null {
    return this.profileImageUrl ?? null;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getLockedUntil(): Date | null {
    return this.lockedUntil ?? null;
  }

  public getSnapshot(): UserSnapshot {
    return {
      id: this.id,
      loginId: this.loginId,
      passwordHash: this.passwordHash,
      failedAttempts: this.failedAttempts,
      lockedUntil: this.lockedUntil ?? null,
      role: this.role,
      lastLoginAt: this.lastLoginAt ?? null,
    };
  }
}
