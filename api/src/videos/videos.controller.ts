import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { ApiResponse } from '@nestjs/swagger';
import {
  mapFormVideoToVideoResponseDto,
  mapFormVideoToVideoResponseDtos,
  VideoResponseDto,
} from './dtos/video-response.dto';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { VideoType } from './video.entity';

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

  @Get('my-watch')
  @ApiPaginatedResponse(VideoResponseDto, 'List of watched videos')
  async getMyVideosWatched(
    @Query() params: QueryGetWithParamsDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query('type') type: VideoType,
  ): Promise<PaginatedResponse<VideoResponseDto>> {
    const pageQuery = new PageQuery(Number(params.page), Number(params.limit));
    const reponse = await this.videosService.getMyVideosWatched(
      tokenPayload.id,
      pageQuery,
      params.search,
      type,
    );
    return new PaginatedResponse<VideoResponseDto>(
      mapFormVideoToVideoResponseDtos(reponse.data),
      pageQuery,
      reponse.meta.itemCount,
    );
  }

  @Patch('add-to-watch/:id')
  @ApiResponse({
    status: 200,
    description: 'Video added to watch list',
    type: VideoResponseDto,
  })
  async addToWatched(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<VideoResponseDto> {
    return mapFormVideoToVideoResponseDto(
      await this.videosService.addToWatched(tokenPayload.id, Number(params.id)),
    );
  }

  @Patch('remove-from-watch/:id')
  @ApiResponse({
    status: 200,
    description: 'Video removed from watched list',
    type: VideoResponseDto,
  })
  async removeFromWatched(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ) {
    return mapFormVideoToVideoResponseDto(
      await this.videosService.removeFromWatched(
        tokenPayload.id,
        Number(params.id),
      ),
    );
  }

  @Patch('add-to-favorites/:id')
  @ApiResponse({
    status: 200,
    description: 'Video added to favorites list',
    type: VideoResponseDto,
  })
  async addToFavorites(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ) {
    return mapFormVideoToVideoResponseDto(
      await this.videosService.addToFavorites(
        tokenPayload.id,
        Number(params.id),
      ),
    );
  }

  @Patch('remove-from-favorites/:id')
  @ApiResponse({
    status: 200,
    description: 'Video removed from favorites list',
  })
  async removeFromFavorites(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ) {
    return mapFormVideoToVideoResponseDto(
      await this.videosService.removeFromFavorites(
        tokenPayload.id,
        Number(params.id),
      ),
    );
  }

  @Get('add-to-seen/:id')
  @ApiResponse({
    status: 200,
    description: 'Video added to seen list',
    type: VideoResponseDto,
  })
  async addToSeen(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<VideoResponseDto> {
    return mapFormVideoToVideoResponseDto(
      await this.videosService.addToSeen(tokenPayload.id, Number(params.id)),
    );
  }

  @Patch('remove-from-seen/:id')
  @ApiResponse({
    status: 200,
    description: 'Video removed from seen list',
  })
  async removeFromSeen(
    @Param('id') params: { id: string },
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ) {
    await this.videosService.removeFromSeen(tokenPayload.id, Number(params.id));
  }

  @Get('casting/:id')
  async getCasting(@Param('id') id: string) {
    return this.videosService.getCasting(Number(id));
  }

  @Get('similars/:id')
  async getSimilar(@Param('id') id: string) {
    return this.videosService.getSimilar(Number(id));
  }

  @Get('providers/:id')
  async getProviders(@Param('id') id: string) {
    return this.videosService.getProviders(Number(id));
  }
}
