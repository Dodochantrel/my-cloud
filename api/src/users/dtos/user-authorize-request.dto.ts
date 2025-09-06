import { ApiProperty } from '@nestjs/swagger';

export class UserAuthorizeRequestDto {
  @ApiProperty({
    description: 'Id of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Whether the user is authorized or not',
    example: true,
  })
  isAuthorized: boolean;
}
