import { User } from '@/user/domain/user.entity';
import { UserResult } from './user.result';

export class GetUsersResult {
  constructor(
    public readonly items: UserResult[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}

  static fromEntities(entities: User[], total: number, page: number, limit: number) {
    const items = entities.map((user) => UserResult.fromEntity(user));
    return new GetUsersResult(items, total, page, limit);
  }
}
