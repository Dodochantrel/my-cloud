import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbRepositoryRepository } from './tmdb/tmdb-repository.repository';
import { Video, VideoType } from './video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';
import { User } from 'src/users/user.entity';

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

  async addToWatched(userId: number, videoId: number): Promise<Video> {
    const video = await this.getMovieFromDbOrTmdb(userId, videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    video.isSeen = true;
    return this.videoRepository.save(video);
  }

  async removeFromWatched(userId: number, videoId: number): Promise<Video> {
    const video = await this.videoRepository.findOneBy({
      id: videoId,
      user: { id: userId },
    });
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    video.isSeen = false;
    return this.videoRepository.save(video);
  }

  async addToFavorites(userId: number, videoId: number): Promise<Video> {
    const video = await this.getMovieFromDbOrTmdb(userId, videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    video.isFavorite = true;
    video.isSeen = true;
    return this.videoRepository.save(video);
  }

  async removeFromFavorites(userId: number, videoId: number): Promise<Video> {
    const video = await this.videoRepository.findOneBy({
      id: videoId,
      user: { id: userId },
    });
    video.isFavorite = false;
    return this.videoRepository.save(video);
  }

  async addToSeen(userId: number, videoId: number): Promise<Video> {
    const video = await this.getMovieFromDbOrTmdb(userId, videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    video.isSeen = true;
    return this.videoRepository.save(video);
  }

  async removeFromSeen(userId: number, videoId: number) {
    const video = await this.videoRepository.findOneBy({
      id: videoId,
      user: { id: userId },
    });
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    video.isSeen = false;
    return this.videoRepository.save(video);
  }

  async getMovieFromDbOrTmdb(userId: number, videoId: number): Promise<Video> {
    const video = this.videoRepository.findOneBy({
      id: videoId,
      user: { id: userId },
    });
    if (video) {
      return video;
    } else {
      const video = await this.tmdbRepositoryRepository.getMovie(videoId);
      video.user = new User({ id: userId });
      return this.videoRepository.save(video);
    }
  }

  async getCasting(id: number): Promise<any> {
    return this.tmdbRepositoryRepository.getCasting(id);
  }

  async getSimilar(id: number): Promise<any> {
    return this.tmdbRepositoryRepository.getSimilar(id);
  }

  async getProviders(id: number): Promise<any> {
    return this.tmdbRepositoryRepository.getProviders(id);
  }
}
