import { ApiProperty } from '@nestjs/swagger';
import {
  mapFromUsersToUsersResponseDto,
  UserResponseDto,
} from 'src/users/dtos/user-response.dto';
import { Group } from '../group.entity';

export class GroupResponseDto {
  @ApiProperty({
    description: 'Id of the group',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the group',
    example: 'My Group',
  })
  name: string;

  @ApiProperty({
    description: 'Users of the group',
  })
  users: UserResponseDto[];
}

export const mapFromGroupToGroupResponseDto = (
  group: Group,
): GroupResponseDto => {
  return {
    id: group.id,
    name: group.name,
    users: group.users ? mapFromUsersToUsersResponseDto(group.users) : [],
  };
};

export const mapFromGroupsToGroupsResponseDto = (
  groups: Group[],
): GroupResponseDto[] => {
  return groups.map((group) => mapFromGroupToGroupResponseDto(group));
};
