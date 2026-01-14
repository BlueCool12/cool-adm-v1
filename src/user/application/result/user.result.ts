import { UserRole } from '@/user/domain/user-role.enum';

export class UserResult {
  constructor(
    readonly id: string,
    readonly loginId: string,
    readonly name: string | null,
    readonly nickname: string | null,
    readonly role: UserRole,
  ) {}
}
