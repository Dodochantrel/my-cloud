import { ApiProperty } from '@nestjs/swagger';
import { EventsDataCategory } from '../events-data-category.entity';

export class EventsDataCategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the event category',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the event category',
    example: 'Birthday',
  })
  name: string;

  @ApiProperty({
    description: 'Color associated with the event category',
    example: '#FF5733',
  })
  color: string;

  @ApiProperty({
    description: 'Is the event category recurring every year automatically',
    example: false,
    default: false,
  })
  isAutomaticallyEveryYear?: boolean;

  @ApiProperty({
    description: 'Is the event category recurring every month automatically',
    example: false,
    default: false,
  })
  isAutomaticallyEveryMonth?: boolean;

  @ApiProperty({
    description: 'Is the event category recurring every week automatically',
    example: false,
    default: false,
  })
  isAutomaticallyEveryWeek?: boolean;

  constructor(partial: Partial<EventsDataCategoryResponseDto>) {
    Object.assign(this, partial);
  }
}

export const mapFromEventsDataCategoryToEventsDataCategoryResponseDto = (
  eventsDataCategory: EventsDataCategory,
): EventsDataCategoryResponseDto => {
  return new EventsDataCategoryResponseDto({
    id: eventsDataCategory.id,
    name: eventsDataCategory.name,
    color: eventsDataCategory.color,
    isAutomaticallyEveryYear: eventsDataCategory.isAutomaticallyEveryYear,
    isAutomaticallyEveryMonth: eventsDataCategory.isAutomaticallyEveryMonth,
    isAutomaticallyEveryWeek: eventsDataCategory.isAutomaticallyEveryWeek,
  });
};

export const mapFromEventsDataCategoryToEventsDataCategoryResponseDtos = (
  eventsDataCategories: EventsDataCategory[],
): EventsDataCategoryResponseDto[] => {
  return eventsDataCategories.map((eventsDataCategory) =>
    mapFromEventsDataCategoryToEventsDataCategoryResponseDto(
      eventsDataCategory,
    ),
  );
};
