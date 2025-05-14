import { ApiProperty } from '@nestjs/swagger';
import { EventDataType } from '../event-data-type.entity';

export class EventDataTypeResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the event data type',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the event data type',
    example: 'Birthday',
  })
  name: string;

  @ApiProperty({
    description: 'The color associated with the event data type',
    example: '#FF5733',
  })
  color: string;

  @ApiProperty({
    description: 'Boolean indicating if the event occurs every year',
    example: false,
  })
  isAutomaticallyEveryYear: boolean;

  @ApiProperty({
    description: 'Boolean indicating if the event occurs every week',
    example: false,
  })
  isAutomaticallyEveryMonth: boolean;

  @ApiProperty({
    description: 'Boolean indicating if the event occurs every week',
    example: false,
  })
  isAutomaticallyEveryWeek: boolean;

  constructor(partial: Partial<EventDataTypeResponseDto>) {
    Object.assign(this, partial);
  }
}

export const mapFromEventDataTypeToEventDataTypeResponseDto = (
  eventDataType: EventDataType,
): EventDataTypeResponseDto => {
  return new EventDataTypeResponseDto({
    id: eventDataType.id,
    name: eventDataType.name,
    color: eventDataType.color,
    isAutomaticallyEveryYear: eventDataType.isAutomaticallyEveryYear,
    isAutomaticallyEveryMonth: eventDataType.isAutomaticallyEveryMonth,
    isAutomaticallyEveryWeek: eventDataType.isAutomaticallyEveryWeek,
  });
};

export const mapFromEventDataTypeToEventDataTypeResponseDtos = (
  eventDataTypes: EventDataType[],
): EventDataTypeResponseDto[] => {
  return eventDataTypes.map((event) =>
    mapFromEventDataTypeToEventDataTypeResponseDto(event),
  );
};
