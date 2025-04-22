import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(
    userId: number,
    group: Group,
    usersId: number[],
  ): Promise<Group> {
    const groupInDb = await this.userRepository.findOne({
      where: { id: group.id, users: { id: userId } },
      relations: ['users'],
    });
    if (!groupInDb) {
      throw new NotFoundException('Group not found');
    }
    groupInDb.name = group.name;
    groupInDb.users.push(...usersId.map((userId) => new User({ id: userId })));
    return this.userRepository.save(groupInDb);
  }
}
