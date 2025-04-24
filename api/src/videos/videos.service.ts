import { Injectable } from '@nestjs/common';
import { TmdbRepositoryRepository } from './tmdb/tmdb-repository.repository';
import { Video } from './video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';

@Injectable()
export class VideosService {
  constructor(
    private readonly tmdbRepositoryRepository: TmdbRepositoryRepository,
    @InjectRepository(Video)
    private userRepository: Repository<Video>,
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
  ): Promise<PaginatedResponse<Video>> {
    const [data, count] = await this.userRepository.findAndCount({
      where: {
        user: { id: userId },
        isSeen: true,
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
    const video = await this.userRepository.findOneBy({
      id: videoId,
      user: { id: userId },
    });
    if (!video) {
      throw new Error('Video not found');
    }
    video.isSeen = true;
    return this.userRepository.save(video);
  }
}
