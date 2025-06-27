import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { TastingsService } from './tastings.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  mapFromTastingCategories,
  TastingCategoryResponseDto,
} from './dto/tasting-category-response.dto';
import { TastingRequestDto } from './dto/tasting-request.dto';
import {
  mapFromTastingsToDtos,
  mapFromTastingToDto,
  TastingResponseDto,
} from './dto/tasting-response.dto';
import { Tasting } from './tasting.entity';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { PageQuery } from 'src/pagination/page-query';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { PaginatedResponse } from 'src/pagination/paginated-response';

@Controller('tastings')
export class TastingsController {
  constructor(private readonly tastingsService: TastingsService) {}

  @Get('categories')
  @ApiResponse({
    status: 200,
    description: 'Returns all tasting categories.',
    type: [TastingCategoryResponseDto],
  })
  async getCategories(): Promise<TastingCategoryResponseDto[]> {
    return mapFromTastingCategories(
      await this.tastingsService.findCategories(),
    );
  }

  @Post('')
  @ApiBody({
    type: TastingRequestDto,
    description: 'Create a new tasting request.',
  })
  @ApiResponse({
    status: 201,
    description: 'The tasting has been successfully created.',
    type: TastingResponseDto,
  })
  async create(@Body() dto: TastingRequestDto): Promise<TastingResponseDto> {
    return mapFromTastingToDto(
      await this.tastingsService.save(
        new Tasting({
          name: dto.name,
          description: dto.description,
          rating: dto.rating,
        }),
      ),
    );
  }

  @Get()
  @ApiPaginatedResponse(TastingResponseDto, 'Returns all tastings.')
  async findAll(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query() params: QueryGetWithParamsDto,
    @Query('categoryId') categoryId: number,
  ): Promise<PaginatedResponse<TastingResponseDto>> {
    const paginatedResponse = await this.tastingsService.findMy(
      tokenPayload.id,
      new PageQuery(params.page, params.limit),
      categoryId || null,
      params.search || null,
    );
    return new PaginatedResponse<TastingResponseDto>(
      mapFromTastingsToDtos(paginatedResponse.data),
      new PageQuery(params.page, params.limit),
      paginatedResponse.meta.itemCount,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns a tasting by ID.',
    type: TastingResponseDto,
  })
  async findById(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query('id') id: number,
  ): Promise<TastingResponseDto | null> {
    const tasting = await this.tastingsService.findById(id, tokenPayload.id);
    return tasting ? mapFromTastingToDto(tasting) : null;
  }

  @Patch(':id')
  @ApiBody({
    type: TastingRequestDto,
    description: 'Update an existing tasting.',
  })
  @ApiResponse({
    status: 200,
    description: 'The tasting has been successfully updated.',
    type: TastingResponseDto,
  })
  async update(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query('id') id: number,
    @Body() dto: TastingRequestDto,
  ): Promise<TastingResponseDto | null> {
    const tasting = new Tasting({
      id,
      name: dto.name,
      description: dto.description,
      rating: dto.rating,
    });
    return mapFromTastingToDto(
      await this.tastingsService.update(tokenPayload.id, tasting),
    );
  }
}
