import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { WidthOptions } from 'src/files/files.manager';
import { User } from 'src/users/user.entity';
import { TastingCategory } from './tasting-category.entity';

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
  async create(
    @Body() dto: TastingRequestDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<TastingResponseDto> {
    return mapFromTastingToDto(
      await this.tastingsService.save(
        new Tasting({
          name: dto.name,
          description: dto.description,
          rating: dto.rating,
          category: new TastingCategory({ id: dto.categoryId }),
          user: new User({ id: tokenPayload.id }),
        }),
      ),
    );
  }

  @Get()
  @ApiPaginatedResponse(TastingResponseDto, 'Returns all tastings.')
  async findAll(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query() params: QueryGetWithParamsDto,
    @Query('categoryId') categoriesIdString: string,
  ): Promise<PaginatedResponse<TastingResponseDto>> {
    const categoriesId = categoriesIdString
      ? categoriesIdString
          .split(',')
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id))
      : [];

    const paginatedResponse = await this.tastingsService.findMy(
      tokenPayload.id,
      new PageQuery(params.page, params.limit),
      categoriesId,
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
    @Query('id') id: string,
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
    @Param('id') id: string,
    @Body() dto: TastingRequestDto,
  ): Promise<TastingResponseDto | null> {
    const tasting = new Tasting({
      id: id,
      name: dto.name,
      description: dto.description,
      rating: dto.rating,
      category: new TastingCategory({ id: dto.categoryId }),
    });
    return mapFromTastingToDto(
      await this.tastingsService.update(tokenPayload.id, tasting),
    );
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() { id }: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tastingsService.uploadFile(id, file, tokenPayload.id);
  }

  @Get('file/:id')
  @ApiResponse({
    status: 200,
    description: 'Returns the file of a tasting by ID.',
    type: String,
  })
  async getFile(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
    @Res() res: Response,
    @Query('width') width?: WidthOptions,
  ) {
    return res.sendFile(
      await this.tastingsService.getFile(id, tokenPayload.id, width),
    );
  }

  @Delete(':id')
  async delete(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
  ) {
    return this.tastingsService.delete(id, tokenPayload.id);
  }
}
