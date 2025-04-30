import { ApiProperty } from '@nestjs/swagger';

export class EventDataTypeRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'The name of the event data type',
    example: 'Birthday',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'The color of the event data type',
    example: '#FF5733',
  })
  color: string;
}
