import { UserRole } from '@/user/domain/user-role.enum';

export class CreateUserCommand {
  constructor(
    public readonly loginId: string,
    public readonly password: string,
    public readonly name: string,
    public readonly nickname: string,
    public readonly role: UserRole,
  ) {}
}
