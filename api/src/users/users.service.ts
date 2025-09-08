import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Not, Repository } from 'typeorm';
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

  getMe(id: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  isFirstUser(): Promise<boolean> {
    return this.userRepository.count().then((count) => count === 0);
  }

  getOneById(id: string, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations,
    });
  }

  async getAll(
    search: string,
    pageQuery: PageQuery,
    relations: string[] = [],
  ): Promise<PaginatedResponse<User>> {
    const [user, count] = await this.userRepository.findAndCount({
      where: search ? { email: Like(`%${search}%`) } : {},
      take: pageQuery.limit,
      skip: pageQuery.offset,
      relations,
    });
    return new PaginatedResponse<User>(user, pageQuery, count);
  }

  async getUsersByGroupId(
    groupId: string,
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

  async getMinimalUsers(id: string): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName'],
      where: { id: Not(id) },
    });
  }

  async authorize(id: string, isAuthorized: boolean): Promise<User> {
    const user = await this.getOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isAuthorized = isAuthorized;
    return this.save(user);
  }
}
