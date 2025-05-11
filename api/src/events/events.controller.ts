import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiResponse } from '@nestjs/swagger';
import {
  EventDataResponseDto,
  mapFromEventDataToEventDataResponseDtos,
} from './dto/event-data-response.dto';
import { EventDataQueryDto } from './dto/event-data-query.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of events',
    type: [EventDataResponseDto],
  })
  async findAll(
    @Query() query: EventDataQueryDto,
  ): Promise<EventDataResponseDto[]> {
    return mapFromEventDataToEventDataResponseDtos(
      await this.eventsService.findAll(
        query.search,
        new Date(query.from),
        new Date(query.to),
      ),
    );
  }
}
