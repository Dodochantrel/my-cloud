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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private userRepository: Repository<Group>,
    private readonly usersService: UsersService,
  ) {}

  async save(userId: string, group: Group, usersId: string[]): Promise<Group> {
    group.users = usersId.map((userId) => new User({ id: userId }));
    group.users.push(new User({ id: userId }));
    return this.userRepository.save(group);
  }

  async getMy(
    userId: string,
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

  async getMyMinimalData(userId: string): Promise<Group[]> {
    return this.userRepository.find({
      where: { users: { id: userId } },
      select: ['id', 'name'],
      relations: ['users'],
    });
  }

  async update(
    userId: string,
    group: Group,
    usersId: string[],
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

  async addUser(
    userId: string,
    groupId: string,
    newUserId: string,
  ): Promise<Group> {
    const group = await this.userRepository.findOne({
      where: { id: groupId, users: { id: userId } },
      relations: ['users'],
    });
    this.checkIfCanEdit(group, userId);
    const alreadyInGroup = group.users.some((user) => user.id === newUserId);
    if (alreadyInGroup) {
      throw new UnauthorizedException('User already in group');
    }
    const newUser = await this.usersService.getOneById(newUserId);
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    group.users.push(newUser);
    return this.userRepository.save(group);
  }

  async removeUser(
    userId: string,
    groupId: string,
    userToRemoveId: string,
  ): Promise<Group> {
    const groupInDb = await this.userRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });
    this.checkIfCanEdit(groupInDb, userId);
    if (!groupInDb.users.some((user) => user.id === userToRemoveId)) {
      throw new UnauthorizedException('User not in group');
    }
    groupInDb.users = groupInDb.users.filter(
      (user) => user.id !== userToRemoveId,
    );
    return this.userRepository.save(groupInDb);
  }

  async delete(userId: string, groupId: string): Promise<void> {
    const group = await this.userRepository.findOne({
      where: { id: groupId, users: { id: userId } },
      relations: ['users'],
    });
    this.checkIfCanEdit(group, userId);
    // Supprmier les utilisateurs du groupe
    group.users = [];
    // Supprimer le groupe
    await this.userRepository.save(group);
    // Supprimer le groupe de la base de données
    await this.userRepository.delete(group.id);
  }

  checkIfCanEdit(group: Group, userId: string): void {
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (!group.users.some((user) => user.id === userId)) {
      throw new UnauthorizedException('You are not allowed to edit this group');
    }
  }

  async hasUserInGroup(groupId: string, userId: string): Promise<boolean> {
    const group = await this.userRepository.findOne({
      where: { id: groupId, users: { id: userId } },
      relations: ['users'],
    });
    if (!group) {
      throw new UnauthorizedException('You are not member of this group');
    }
    return true;
  }
}
