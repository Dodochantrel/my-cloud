import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Group } from './group.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { User } from 'src/users/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private userRepository: Repository<Group>,
  ) {}

  async save(userId: number, group: Group, usersId: number[]): Promise<Group> {
    group.users = usersId.map((userId) => new User({ id: userId }));
    group.users.push(new User({ id: userId }));
    return this.userRepository.save(group);
  }

  async getMy(
    userId: number,
    pageQuery: PageQuery,
    search: string,
  ): Promise<PaginatedResponse<Group>> {
    const [data, count] = await this.userRepository.findAndCount({
      where: [{ users: { id: userId } }, { name: Like(`%${search}%`) }],
      relations: ['users'],
      skip: (pageQuery.page - 1) * pageQuery.limit,
      take: pageQuery.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return new PaginatedResponse<Group>(data, pageQuery, count);
  }

  async getMyMinimalData(userId: number): Promise<Group[]> {
    return this.userRepository.find({
      where: { users: { id: userId } },
      select: ['id', 'name'],
      relations: ['users'],
    });
  }

  async update(
    userId: number,
    group: Group,
    usersId: number[],
  ): Promise<Group> {
    const groupInDb = await this.userRepository.findOne({
      where: { id: group.id, users: { id: userId } },
      relations: ['users'],
    });
    this.checkIfCanEdit(groupInDb, userId);
    groupInDb.name = group.name;
    groupInDb.users.push(...usersId.map((userId) => new User({ id: userId })));
    return this.userRepository.save(groupInDb);
  }

  async addUsers(
    userId: number,
    groupId: number,
    newUserId: number,
  ): Promise<Group> {
    const groupInDb = await this.userRepository.findOne({
      where: { id: groupId, users: { id: userId } },
      relations: ['users'],
    });
    this.checkIfCanEdit(groupInDb, userId);
    if (groupInDb.users.some((user) => user.id === newUserId)) {
      throw new UnauthorizedException('User already in group');
    }
    return this.userRepository.save(groupInDb);
  }

  checkIfCanEdit(group: Group, userId: number): void {
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (!group.users.some((user) => user.id === userId)) {
      throw new UnauthorizedException('You are not allowed to edit this group');
    }
  }
}
