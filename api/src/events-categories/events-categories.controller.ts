import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsCategoriesService } from './events-categories.service';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { Roles } from 'src/roles/role.decorateur';
import { Role } from 'src/roles/role.enum';
import {
  EventsDataCategoryResponseDto,
  mapFromEventsDataCategoryToEventsDataCategoryResponseDto,
  mapFromEventsDataCategoryToEventsDataCategoryResponseDtos,
} from './dto/events-data-category-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  EventsDataCategoryRequestDto,
  mapFromEventsDataCategoryRequestDtoToEventsDataCategory,
} from './dto/events-data-category-request.dto';
import { AuthGuard } from 'src/authentications/auth.guard';

@Controller('events-categories')
export class EventsCategoriesController {
  constructor(
    private readonly eventsCategoriesService: EventsCategoriesService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiPaginatedResponse(
    EventsDataCategoryResponseDto,
    'Returns a list of all events data categories with full information.',
  )
  async getAllEventsDataCategories(
    @Query() query: QueryGetWithParamsDto,
  ): Promise<PaginatedResponse<EventsDataCategoryResponseDto>> {
    const response = await this.eventsCategoriesService.getAll(
      query.search,
      new PageQuery(query.page, query.limit),
    );
    return new PaginatedResponse<EventsDataCategoryResponseDto>(
      mapFromEventsDataCategoryToEventsDataCategoryResponseDtos(response.data),
      new PageQuery(query.page, query.limit),
      response.meta.itemCount,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiBody({
    description: 'Create a new event category',
    type: EventsDataCategoryRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The event category has been successfully created.',
    type: EventsDataCategoryResponseDto,
  })
  async createEventCategory(@Body() body: EventsDataCategoryRequestDto) {
    return mapFromEventsDataCategoryToEventsDataCategoryResponseDto(
      await this.eventsCategoriesService.save(
        mapFromEventsDataCategoryRequestDtoToEventsDataCategory(body),
      ),
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiBody({
    description: 'Update an existing event category',
    type: EventsDataCategoryRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The event category has been successfully updated.',
    type: EventsDataCategoryResponseDto,
  })
  async updateEventCategory(
    @Body() body: EventsDataCategoryRequestDto,
    @Param('id') id: string,
  ) {
    const category =
      mapFromEventsDataCategoryRequestDtoToEventsDataCategory(body);
    category.id = id;
    return mapFromEventsDataCategoryToEventsDataCategoryResponseDto(
      await this.eventsCategoriesService.save(category),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiResponse({
    status: 200,
    description: 'The event category has been successfully deleted.',
  })
  async deleteEventCategory(@Param('id') id: string) {
    await this.eventsCategoriesService.delete(id);
  }
}
