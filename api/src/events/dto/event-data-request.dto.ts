import { ApiProperty } from '@nestjs/swagger';

export class EventDataRequestDto {
  @ApiProperty({
    description: 'The name of the event data',
    example: 'Birthday',
  })
  name: string;

  @ApiProperty({
    description: 'The color of the event data',
    example: '#FF5733',
  })
  color: string;

  @ApiProperty({
    description: 'Groups the event data belongs to',
    example: [1, 2, 3],
  })
  groupsId: number[];
}
