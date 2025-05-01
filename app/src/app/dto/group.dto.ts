import { Group } from '../class/group';
import { mapFromDtosToUsers, UserDto } from './user.dto';

export interface GroupDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  users: UserDto[];
}

export const mapFromGroupDtoToGroup = (groupDto: GroupDto): Group => {
  return {
    id: groupDto.id,
    name: groupDto.name,
    createdAt: new Date(groupDto.createdAt),
    updatedAt: new Date(groupDto.updatedAt),
    users: mapFromDtosToUsers(groupDto.users),
  };
};

export const mapFromDtosToGroups = (groupDtos: GroupDto[]): Group[] => {
  return groupDtos.map((groupDto) => mapFromGroupDtoToGroup(groupDto));
};
