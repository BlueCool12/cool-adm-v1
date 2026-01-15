import { GetUsersResult } from '@/user/application/result/get-users.result';
import { UserResponse } from './user.response';

export class GetUsersResponse {
  constructor(
    public readonly items: UserResponse[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}

  static fromResult(result: GetUsersResult): GetUsersResponse {
    const items = result.items.map((user) => UserResponse.fromResult(user));
    return new GetUsersResponse(items, result.total, result.page, result.limit);
  }
}
