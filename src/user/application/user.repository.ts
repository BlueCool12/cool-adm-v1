import { AuthCredential } from '@/auth/domain/auth-credential';
import { User } from '@/user/domain/user.entity';
import { UserRole } from '@/user/domain/user-role.enum';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;

  abstract saveAuthStatus(snapshot: ReturnType<AuthCredential['getSnapshot']>): Promise<void>;

  abstract findById(id: string): Promise<User | null>;

  abstract findByLoginId(loginId: string): Promise<AuthCredential | null>;

  abstract findAll(options: {
    skip: number;
    take: number;
    role?: UserRole;
    search?: string;
  }): Promise<[User[], number]>;

  abstract updateRefreshToken(userId: string, hash: string | null): Promise<void>;

  abstract remove(userId: string): Promise<void>;
}
