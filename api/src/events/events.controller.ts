import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  EventDataResponseDto,
  mapFromEventDataToEventDataResponseDtos,
} from './dto/event-data-response.dto';
import { EventDataQueryDto } from './dto/event-data-query.dto';
import { EventDataRequestDto } from './dto/event-data-request.dto';
import { EventData } from './event-data.entity';
import { EventDataType } from './event-data-type.entity';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { User } from 'src/users/user.entity';
import { Group } from 'src/groups/group.entity';
import {
  EventDataTypeResponseDto,
  mapFromEventDataTypeToEventDataTypeResponseDtos,
} from './dto/event-data-type-response.dto';

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

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventDataResponseDto,
  })
  @ApiBody({
    type: EventDataRequestDto,
    description: 'Event data to create',
  })
  async create(
    @Body() dto: EventDataRequestDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<EventDataResponseDto[]> {
    return mapFromEventDataToEventDataResponseDtos(
      await this.eventsService.save(
        new EventData({
          name: dto.name,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          description: dto.description,
          isEveryWeek: dto.isEveryWeek,
          isEveryMonth: dto.isEveryMonth,
          isEveryYear: dto.isEveryYear,
          eventDataType: new EventDataType({
            id: dto.eventDataTypeId,
          }),
          user: new User({
            id: tokenPayload.id,
          }),
          groups: dto.groupsId
            ? dto.groupsId.map(
                (groupId) =>
                  new Group({
                    id: groupId,
                  }),
              )
            : [],
        }),
      ),
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
  })
  async delete(
    @Param('id') id: string,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<void> {
    await this.eventsService.delete(id, tokenPayload.id);
  }

  @Get('types')
  @ApiResponse({
    status: 200,
    description: 'List of event types',
    type: [EventDataType],
  })
  async findAllTypes(): Promise<EventDataTypeResponseDto[]> {
    return mapFromEventDataTypeToEventDataTypeResponseDtos(
      await this.eventsService.findAllTypes(),
    );
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventDataResponseDto,
  })
  @ApiBody({
    type: EventDataRequestDto,
    description: 'Event data to update',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: EventDataRequestDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<EventDataResponseDto[]> {
    return mapFromEventDataToEventDataResponseDtos(
      await this.eventsService.update(
        tokenPayload.id,
        new EventData({
          id: id,
          name: dto.name,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          description: dto.description,
          isEveryWeek: dto.isEveryWeek,
          isEveryMonth: dto.isEveryMonth,
          isEveryYear: dto.isEveryYear,
          eventDataType: new EventDataType({
            id: dto.eventDataTypeId,
          }),
          user: new User({
            id: tokenPayload.id,
          }),
          groups: dto.groupsId
            ? dto.groupsId.map(
                (groupId) =>
                  new Group({
                    id: groupId,
                  }),
              )
            : [],
        }),
      ),
    );
  }
}
