import { UserRole } from '@/user/domain/user-role.enum';

export class AuthDomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly type: 'UNAUTHORIZED' | 'LOCKED',
  ) {
    super(message);
  }
}

export class AuthCredential {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_TIME_MS = 30 * 60 * 1000;

  constructor(
    private readonly id: string,
    private readonly loginId: string,
    private passwordHash: string,
    private failedAttempts: number = 0,
    private lockedUntil: Date | null = null,
    private readonly role: UserRole,
    private lastLoginAt: Date | null = null,
  ) {}

  public static restore(params: {
    id: string;
    loginId: string;
    passwordHash: string;
    failedAttempts: number;
    lockedUntil: Date | null;
    role: UserRole;
    lastLoginAt: Date | null;
  }): AuthCredential {
    return new AuthCredential(
      params.id,
      params.loginId,
      params.passwordHash,
      params.failedAttempts,
      params.lockedUntil,
      params.role,
      params.lastLoginAt,
    );
  }

  public async authenticate(
    inputPassword: string,
    verifier: (raw: string, hashed: string) => Promise<boolean>,
  ): Promise<void> {
    this.checkIfLocked();

    const isMatch = await verifier(inputPassword, this.passwordHash);
    if (!isMatch) {
      this.handleFailedAttempt();
      throw new AuthDomainError('아이디 또는 비밀번호가 일치하지 않습니다.', 'UNAUTHORIZED');
    }

    this.resetStatus();
  }

  private checkIfLocked() {
    if (this.lockedUntil && this.lockedUntil > new Date()) {
      throw new AuthDomainError('계정이 잠겨 있습니다.', 'LOCKED');
    }
  }

  private handleFailedAttempt() {
    this.failedAttempts++;
    if (this.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      this.lockedUntil = new Date(Date.now() + this.LOCK_TIME_MS);
    }
  }

  private resetStatus() {
    this.failedAttempts = 0;
    this.lockedUntil = null;
    this.lastLoginAt = new Date();
  }

  public getSnapshot() {
    return {
      id: this.id,
      loginId: this.loginId,
      passwordHash: this.passwordHash,
      failedAttempts: this.failedAttempts,
      lockedUntil: this.lockedUntil,
      role: this.role,
      lastLoginAt: this.lastLoginAt,
    };
  }
}
