import { ApiProperty } from '@nestjs/swagger';
import {
  mapFromUsersToUsersResponseDto,
  UserResponseDto,
} from 'src/users/dtos/user-response.dto';
import { Group } from '../group.entity';

export class GroupResponseDto {
  @ApiProperty({
    description: 'Id of the group',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the group',
    example: 'My Group',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'The date when the group was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    type: 'string',
    description: 'The date when the group was last updated',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt: string;

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
    createdAt: group.createdAt ? group.createdAt.toISOString() : null,
    updatedAt: group.createdAt ? group.updatedAt.toISOString() : null,
    users: group.users ? mapFromUsersToUsersResponseDto(group.users) : [],
  };
};

export const mapFromGroupsToGroupsResponseDto = (
  groups: Group[],
): GroupResponseDto[] => {
  return groups.map((group) => mapFromGroupToGroupResponseDto(group));
};
