import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getOneByEmail(email: string, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations,
    });
  }

  getOneById(id: number, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations,
    });
  }

  async getAll(
    pageQuery: PageQuery,
    relations: string[] = [],
  ): Promise<PaginatedResponse<User>> {
    const [user, count] = await this.userRepository.findAndCount({
      take: pageQuery.limit,
      skip: pageQuery.offset,
      relations,
    });
    return new PaginatedResponse<User>(user, pageQuery, count);
  }

  async getUsersByGroupId(
    groupId: number,
    pageQuery: PageQuery,
    relations: string[] = [],
  ): Promise<PaginatedResponse<User>> {
    const [user, count] = await this.userRepository.findAndCount({
      where: { groups: { id: groupId } },
      take: pageQuery.limit,
      skip: pageQuery.offset,
      relations,
    });
    return new PaginatedResponse<User>(user, pageQuery, count);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getMinimalUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName'],
    });
  }
}
