import { ApiProperty } from '@nestjs/swagger';

export class AddUserGroupRequestDto {
  @ApiProperty({
    description: 'Id of the group',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Users id of the group',
    example: [1, 2, 3],
  })
  usersId: number[];
}
