import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/user/application/user.repository';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`해당 ID(${id})의 유저를 찾을 수 없습니다.`);
    return user;
  }
}
