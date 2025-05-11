import { ApiProperty } from '@nestjs/swagger';

export class AddOrRemoveUserGroupRequestDto {
  @ApiProperty({
    description: 'User id of the group',
    example: 1,
  })
  userId: number;
}
