import { ApiProperty } from '@nestjs/swagger';
import { EventsDataCategory } from '../events-data-category.entity';

export class EventsDataCategoryRequestDto {
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

  constructor(partial: Partial<EventsDataCategoryRequestDto>) {
    Object.assign(this, partial);
  }
}

export function mapFromEventsDataCategoryRequestDtoToEventsDataCategory(
  dto: EventsDataCategoryRequestDto,
): EventsDataCategory {
  return new EventsDataCategory({
    name: dto.name,
    color: dto.color,
    isAutomaticallyEveryYear: dto.isAutomaticallyEveryYear ?? false,
    isAutomaticallyEveryMonth: dto.isAutomaticallyEveryMonth ?? false,
    isAutomaticallyEveryWeek: dto.isAutomaticallyEveryWeek ?? false,
  });
}
