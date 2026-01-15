import { UserRole } from '@/user/domain/user-role.enum';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly nickname: string,
    public readonly role: UserRole,
    public readonly password?: string,
  ) {}
}
