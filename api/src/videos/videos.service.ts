import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbRepositoryRepository } from './tmdb/tmdb-repository.repository';
import { Video, VideoType } from './video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';
import { VideoProvider } from './interfaces/provider.interface';
import { Casting } from './interfaces/casting.interface';
import { Director } from './interfaces/director.interface';

@Injectable()
export class VideosService {
  constructor(
    private readonly tmdbRepositoryRepository: TmdbRepositoryRepository,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  getMovies(search: string): Promise<Video[]> {
    return this.tmdbRepositoryRepository.getMovies(search);
  }

  getSeries(search: string): Promise<Video[]> {
    return this.tmdbRepositoryRepository.getSeries(search);
  }

  async getMyVideosWatched(
    userId: number,
    pageQuery: PageQuery,
    search: string,
    type: VideoType,
  ): Promise<PaginatedResponse<Video>> {
    const [data, count] = await this.videoRepository.findAndCount({
      where: {
        user: { id: userId },
        type: type,
        isToWatch: true,
        ...(search && {
          title: search,
        }),
      },
      take: pageQuery.limit,
      skip: (pageQuery.page - 1) * pageQuery.limit,
    });

    return new PaginatedResponse<Video>(data, pageQuery, count);
  }

  async getMovieFromDbOrTmdb(userId: number, videoId: number): Promise<Video> {
    const video = await this.videoRepository.findOneBy({
      id: videoId,
      user: { id: userId },
    });
    if (video) {
      const videoFromTmdb =
        await this.tmdbRepositoryRepository.getMovie(videoId);
      videoFromTmdb.isFavorite = video.isFavorite;
      videoFromTmdb.isSeen = video.isSeen;
      videoFromTmdb.isToWatch = video.isToWatch;
      videoFromTmdb.rating = video.rating;
      videoFromTmdb.dateSeen = video.dateSeen;
      videoFromTmdb.user = video.user;
      return videoFromTmdb;
    } else {
      return await this.tmdbRepositoryRepository.getMovie(videoId);
    }
  }

  async save(video: Video): Promise<Video> {
    const videoInDb = await this.getMovieFromDbOrTmdb(video.user.id, video.id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    videoInDb.isSeen = video.isSeen;
    videoInDb.isFavorite = video.isFavorite;
    videoInDb.isToWatch = video.isToWatch;
    videoInDb.rating = video.rating;
    videoInDb.dateSeen = video.dateSeen;
    return this.videoRepository.save(videoInDb);
  }

  async getCasting(id: number): Promise<Casting[]> {
    return this.tmdbRepositoryRepository.getCasting(id);
  }

  async getSimilar(id: number): Promise<Video[]> {
    return this.tmdbRepositoryRepository.getSimilar(id);
  }

  async getProviders(id: number): Promise<VideoProvider[]> {
    return this.tmdbRepositoryRepository.getProviders(id);
  }

  async getMovie(id: number): Promise<Video> {
    const video = await this.tmdbRepositoryRepository.getMovie(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  async getSerie(id: number): Promise<Video> {
    const video = await this.tmdbRepositoryRepository.getSerie(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  async getDirector(id: number): Promise<Director> {
    return this.tmdbRepositoryRepository.getDirector(id);
  }
}
