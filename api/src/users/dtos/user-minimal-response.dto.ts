import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserMinimalResponseDto {
  @ApiProperty({
    description: 'Id of the user',
    example: '1',
  })
  id: string;

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
}

export const mapFromUserToUserMinimalResponseDto = (
  user: User,
): UserMinimalResponseDto => {
  return {
    id: user.id,
    firstName: user.firstName ? user.firstName : null,
    lastName: user.lastName ? user.lastName : null,
    email: user.email ? user.email : null,
  };
};

export const mapFromUsersToUsersMinimalResponseDto = (
  users: User[],
): UserMinimalResponseDto[] => {
  return users.map((user) => mapFromUserToUserMinimalResponseDto(user));
};
