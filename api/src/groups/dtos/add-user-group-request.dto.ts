import { ApiProperty } from '@nestjs/swagger';

export class AddUserGroupRequestDto {
  @ApiProperty({
    description: 'User id of the group',
    example: 1,
  })
  userId: number;
}
