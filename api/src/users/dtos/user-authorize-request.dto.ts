import { ApiProperty } from '@nestjs/swagger';

export class UserAuthorizeRequestDto {
  @ApiProperty({
    description: 'Id of the user',
    example: 1,
  })
  id: number;
}
