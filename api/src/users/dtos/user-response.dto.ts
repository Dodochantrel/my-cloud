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
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const mapFromUsersToUsersResponseDto = (
  users: User[],
): UserResponseDto[] => {
  return users.map((user) => mapFromUserToUserResponseDto(user));
};
