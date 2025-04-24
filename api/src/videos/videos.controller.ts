import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { ApiResponse } from '@nestjs/swagger';
import {
  mapFormVideoToVideoResponseDtos,
  VideoResponseDto,
} from './dtos/video-response.dto';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('movies')
  @ApiResponse({
    status: 200,
    description: 'List of movies',
    type: VideoResponseDto,
  })
  async getMovies(@Query() params: QueryGetWithParamsDto) {
    return mapFormVideoToVideoResponseDtos(
      await this.videosService.getMovies(params.search),
    );
  }

  @Get('series')
  @ApiResponse({
    status: 200,
    description: 'List of series',
    type: VideoResponseDto,
  })
  async getSeries(@Query() params: QueryGetWithParamsDto) {
    return mapFormVideoToVideoResponseDtos(
      await this.videosService.getSeries(params.search),
    );
  }

  @Get('my-watched')
  @ApiPaginatedResponse(VideoResponseDto, 'List of watched videos')
  async getMyVideosWatched(
    @Query() params: QueryGetWithParamsDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<PaginatedResponse<VideoResponseDto>> {
    const pageQuery = new PageQuery(Number(params.page), Number(params.limit));
    const reponse = await this.videosService.getMyVideosWatched(
      tokenPayload.id,
      pageQuery,
      params.search,
    );
    return new PaginatedResponse<VideoResponseDto>(
      mapFormVideoToVideoResponseDtos(reponse.data),
      pageQuery,
      reponse.meta.itemCount,
    );
  }

  @Patch('add-to-watched/:id')
  @ApiResponse({
    status: 200,
    description: 'Video added to watched list',
    type: VideoResponseDto,
  })
  async addToWatched(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ) {
    return await this.videosService.addToWatched(
      tokenPayload.id,
      Number(params.id),
    );
  }
}
