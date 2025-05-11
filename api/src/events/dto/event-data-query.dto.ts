import { ApiProperty } from '@nestjs/swagger';

export class EventDataQueryDto {
  @ApiProperty({
    description: 'From term for the event name',
    example: '2023-10-01T10:00:00Z',
  })
  from: string;

  @ApiProperty({
    description: 'To term for the event name',
    example: '2023-10-01T10:00:00Z',
  })
  to: string;

  @ApiProperty({
    description: 'From date for the event',
    example: 'Brithday Party',
  })
  search: string;
}
