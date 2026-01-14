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
  ) {}

  public static restore(params: {
    id: string;
    loginId: string;
    passwordHash: string;
    failedAttempts: number;
    lockedUntil: Date | null;
    role: UserRole;
  }): AuthCredential {
    return new AuthCredential(
      params.id,
      params.loginId,
      params.passwordHash,
      params.failedAttempts,
      params.lockedUntil,
      params.role,
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
      throw new AuthDomainError('인증에 실패했습니다.', 'UNAUTHORIZED');
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
  }

  public getSnapshot() {
    return {
      id: this.id,
      loginId: this.loginId,
      passwordHash: this.passwordHash,
      failedAttempts: this.failedAttempts,
      lockedUntil: this.lockedUntil,
      role: this.role,
    };
  }
}
