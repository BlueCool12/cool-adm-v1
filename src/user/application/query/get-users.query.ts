import { UserRole } from '@/user/domain/user-role.enum';

export class GetUsersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly role?: UserRole,
    public readonly search?: string,
  ) {}

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get take(): number {
    return this.limit;
  }
}
