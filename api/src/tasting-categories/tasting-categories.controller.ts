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
import {
  mapFromTastingCategories,
  mapFromTastingCategory,
  TastingCategoryResponseDto,
} from './dto/tasting-category-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { TastingCategoriesService } from './tasting-categories.service';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import {
  mapFromRequestDtoToTastingCategory,
  TastingCategoryRequestDto,
} from './dto/tasting-category-request.dto';

@Controller('tasting-categories')
export class TastingCategoriesController {
  constructor(
    private readonly tastingCategoriesService: TastingCategoriesService,
  ) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Returns all tasting categories.',
    type: [TastingCategoryResponseDto],
    isArray: true,
  })
  async getCategories(
    @Query() params: QueryGetWithParamsDto,
  ): Promise<PaginatedResponse<TastingCategoryResponseDto>> {
    const paginatedResponse = await this.tastingCategoriesService.getAll(
      new PageQuery(params.page, params.limit),
    );
    return new PaginatedResponse<TastingCategoryResponseDto>(
      mapFromTastingCategories(paginatedResponse.data),
      new PageQuery(params.page, params.limit),
      paginatedResponse.meta.itemCount,
    );
  }

  @Post('')
  @ApiBody({ type: TastingCategoryRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Returns all tasting categories.',
    type: TastingCategoryResponseDto,
  })
  async create(
    @Body() body: TastingCategoryRequestDto,
  ): Promise<TastingCategoryResponseDto> {
    const category = await this.tastingCategoriesService.create(
      mapFromRequestDtoToTastingCategory(body),
    );
    return mapFromTastingCategory(category);
  }

  @Put(':id')
  @ApiBody({ type: TastingCategoryRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Updates a tasting category.',
    type: TastingCategoryResponseDto,
  })
  async update(
    @Body() body: TastingCategoryRequestDto,
    @Param('id') id: string,
  ): Promise<TastingCategoryResponseDto> {
    const category = mapFromRequestDtoToTastingCategory(body);
    category.id = id;
    return mapFromTastingCategory(
      await this.tastingCategoriesService.update(
        mapFromRequestDtoToTastingCategory(body),
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tastingCategoriesService.delete(id);
  }

  @Get('icons')
  getIcons(): string[] {
    return this.tastingCategoriesService.getIcons();
  }
}
