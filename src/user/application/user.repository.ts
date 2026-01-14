import { AuthCredential } from '@/auth/domain/auth-credential';
import { User } from '@/user/domain/user.entity';

export abstract class UserRepository {
  abstract findByLoginId(loginId: string): Promise<AuthCredential | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract saveAuthStatus(snapshot: ReturnType<AuthCredential['getSnapshot']>): Promise<void>;

  abstract updateRefreshToken(userId: string, hash: string | null): Promise<void>;
}
