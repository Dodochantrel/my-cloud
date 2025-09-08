import { ApiProperty } from '@nestjs/swagger';

export class GroupRequestDto {
  @ApiProperty({
    description: 'Name of the group',
    example: 'My Group',
  })
  name: string;

  @ApiProperty({
    description: 'Users id of the group',
    example: ['1', '2', '3'],
  })
  usersId: string[];
}
