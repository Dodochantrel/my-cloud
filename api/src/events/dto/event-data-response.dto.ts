import { ApiProperty } from '@nestjs/swagger';
import { EventData } from '../event-data.entity';
import {
  EventDataTypeResponseDto,
  mapFromEventDataTypeToEventDataTypeResponseDto,
} from './event-data-type-response.dto';

export class EventDataResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the event',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the event',
    example: 'Birthday Party',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'A fun birthday party with friends and family.',
  })
  description: string;

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
    description: 'Type of the event',
    example: 'EventDataTypeResponseDto',
  })
  type: EventDataTypeResponseDto | null;

  constructor(partial: Partial<EventDataResponseDto>) {
    Object.assign(this, partial);
  }
}

export const mapFromEventDataToEventDataResponseDto = (
  eventData: EventData,
): EventDataResponseDto => {
  return new EventDataResponseDto({
    id: eventData.id,
    name: eventData.name,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    type: eventData.eventDataType
      ? mapFromEventDataTypeToEventDataTypeResponseDto(eventData.eventDataType)
      : null,
  });
};

export const mapFromEventDataToEventDataResponseDtos = (
  eventData: EventData[],
): EventDataResponseDto[] => {
  return eventData.map((event) =>
    mapFromEventDataToEventDataResponseDto(event),
  );
};
