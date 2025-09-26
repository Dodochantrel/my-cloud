import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  mapFromVideoToVideoResponseDto,
  mapFormVideoToVideoResponseDtos,
  VideoResponseDto,
} from './dtos/video-response.dto';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { Video, VideoType } from './video.entity';
import { VideoRequestDto } from './dtos/video-request.dto';
import {
  mapFromDirectorToVideoDirectorResponseDto,
  VideoDirectorResponseDto,
} from './dtos/video-director-response.dto';
import {
  mapFromVideoProvidersToVideoProviderResponseDtos,
  VideoProviderResponseDto,
} from './dtos/video-provider-response.dto';
import {
  mapFromCastingToVideoCastingResponseDtos,
  VideoCastingResponseDto,
} from './dtos/video-casting-response.dto';
import { User } from 'src/users/user.entity';
import {
  mapFromEpisodesToVideoEpisodeResponseDtos,
  VideoEpisodeResponseDto,
} from './dtos/video-episode-reponse.dto';
import { AuthGuard } from 'src/authentications/auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('movies')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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

  @Get('my-seen')
  @UseGuards(AuthGuard)
  @ApiPaginatedResponse(VideoResponseDto, 'List of watched videos')
  async getMyVideosSeen(
    @Query() params: QueryGetWithParamsDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query('type') type: VideoType,
  ): Promise<PaginatedResponse<VideoResponseDto>> {
    const pageQuery = new PageQuery(Number(params.page), Number(params.limit));
    const reponse = await this.videosService.getMyVideosSeen(
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

  @Get('my-to-watch')
  @UseGuards(AuthGuard)
  @ApiPaginatedResponse(VideoResponseDto, 'List of watched videos')
  async getMyVideosToWatch(
    @Query() params: QueryGetWithParamsDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query('type') type: VideoType,
  ): Promise<PaginatedResponse<VideoResponseDto>> {
    const pageQuery = new PageQuery(Number(params.page), Number(params.limit));
    const reponse = await this.videosService.getMyVideosToSeen(
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Add video to watched list',
    type: VideoResponseDto,
  })
  @ApiBody({
    type: VideoRequestDto,
    description: 'Video request body',
  })
  async addToWatched(
    @Param('id') id: string,
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: VideoRequestDto,
  ): Promise<VideoResponseDto> {
    return mapFromVideoToVideoResponseDto(
      await this.videosService.save(
        new Video({
          tmdbId: Number(id),
          type: dto.type,
          isToWatch: dto.isToWatch,
          isSeen: dto.isSeen,
          isFavorite: dto.isFavorite,
          rating: dto.rating,
          dateSeen: dto.dateSeen,
          user: new User({
            id: tokenPayload.id,
          }),
        }),
      ),
    );
  }

  @Get('casting/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of video casting',
    type: VideoCastingResponseDto,
  })
  async getCasting(
    @Param('id') id: string,
    @Query('type') type: VideoType,
  ): Promise<VideoCastingResponseDto[]> {
    return mapFromCastingToVideoCastingResponseDtos(
      await this.videosService.getCasting(Number(id), type),
    );
  }

  @Get('similars/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of similar videos',
    type: VideoResponseDto,
  })
  async getSimilar(
    @Param('id') id: string,
    @Query('type') type: VideoType,
  ): Promise<VideoResponseDto[]> {
    return mapFormVideoToVideoResponseDtos(
      await this.videosService.getSimilar(Number(id), type),
    );
  }

  @Get('providers/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of video providers',
    type: VideoProviderResponseDto,
  })
  async getProviders(
    @Param('id') id: string,
    @Query('type') type: VideoType,
  ): Promise<VideoProviderResponseDto[]> {
    return mapFromVideoProvidersToVideoProviderResponseDtos(
      await this.videosService.getProviders(Number(id), type),
    );
  }

  @Get('director/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get movie by id',
    type: VideoDirectorResponseDto,
  })
  async getDirector(
    @Param('id') id: string,
    @Query('type') type: VideoType,
  ): Promise<VideoDirectorResponseDto> {
    return mapFromDirectorToVideoDirectorResponseDto(
      await this.videosService.getDirector(Number(id), type),
    );
  }

  @Get('movie/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get movie by id',
    type: VideoResponseDto,
  })
  async getMovieFromDbOrTmdb(
    @Param('id') id: string,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<VideoResponseDto> {
    return mapFromVideoToVideoResponseDto(
      await this.videosService.getMovieFromDbOrTmdb(
        tokenPayload.id,
        Number(id),
      ),
    );
  }

  @Get('serie/:id')
  @UseGuards(AuthGuard)
  async getSeriesFromDbOrTmdb(
    @Param('id') id: string,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<VideoResponseDto> {
    return mapFromVideoToVideoResponseDto(
      await this.videosService.getSerieFromDbOrTmdb(
        tokenPayload.id,
        Number(id),
      ),
    );
  }

  @Get('serie/:id/episodes')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get episodes of a serie',
    type: VideoEpisodeResponseDto,
  })
  async getEpisodes(
    @Param('id') id: string,
    @Query('season') season: number,
  ): Promise<VideoEpisodeResponseDto[]> {
    return mapFromEpisodesToVideoEpisodeResponseDtos(
      await this.videosService.getEpisodes(Number(id), season),
    );
  }

  @Get('stats')
  async geType(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query('type') type: VideoType,
  ) {
    return {
      count: 1,
      timeSpent: 1,
      rating: 1,
      countThisMonth: 1,
      countThisYear: 1,
      favoriteType: 'guerre'
    }
  }
}
