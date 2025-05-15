import { ApiProperty } from '@nestjs/swagger';

export class EventDataRequestDto {
  @ApiProperty({
    description: 'Name of the event',
    example: 'Birthday Party',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'A fun birthday party with friends and family.',
  })
  description: string | null;

  @ApiProperty({
    description: 'Start date of the event',
    example: '2023-10-01T10:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the event',
    example: '2023-10-01T12:00:00Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Boolean indicating if the event occurs every year',
    example: false,
  })
  isEveryYear: boolean;

  @ApiProperty({
    description: 'Boolean indicating if the event occurs every week',
    example: false,
  })
  isEveryMonth: boolean;

  @ApiProperty({
    description: 'Boolean indicating if the event occurs every week',
    example: false,
  })
  isEveryWeek: boolean;

  @ApiProperty({
    description: 'ID of the event type',
    example: 1,
  })
  eventDataTypeId: number;

  @ApiProperty({
    description: 'Array of group IDs associated with the event',
    example: [1, 2, 3],
  })
  groupsId: number[];
}
