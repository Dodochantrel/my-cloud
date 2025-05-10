import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Id of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
  })
  email: string;

  @ApiProperty({
    description: 'Creation date of the user',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date of the user',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt: string;
}

export const mapFromUserToUserResponseDto = (user: User): UserResponseDto => {
  return {
    id: user.id,
    firstName: user.firstName ? user.firstName : null,
    lastName: user.lastName ? user.lastName : null,
    email: user.email ? user.email : null,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
  };
};

export const mapFromUsersToUsersResponseDto = (
  users: User[],
): UserResponseDto[] => {
  return users.map((user) => mapFromUserToUserResponseDto(user));
};
