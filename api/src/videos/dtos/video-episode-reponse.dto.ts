import { ApiProperty } from '@nestjs/swagger';
import { Episode } from '../interfaces/episode.interface';

export class VideoEpisodeResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the episode',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the episode',
    example: 'Pilot',
  })
  number: number;

  @ApiProperty({
    description: 'The name of the episode',
    example: 'Pilot',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the episode',
    example: 'In this episode, we are introduced to the main characters.',
  })
  description: string;

  @ApiProperty({
    description: 'The air date of the episode',
    example: '2023-10-01T00:00:00Z',
  })
  airDate: string;

  @ApiProperty({
    description: 'The duration of the episode in seconds',
    example: 3600,
  })
  duration: number;

  @ApiProperty({
    description: 'The URL of the episode file',
    example: 'https://example.com/episode1.mp4',
  })
  fileUrl: string;
}

export const mapFromEpisodeToVideoEpisodeResponseDto = (
  episode: Episode,
): VideoEpisodeResponseDto => {
  const videoEpisodeResponseDto = new VideoEpisodeResponseDto();
  videoEpisodeResponseDto.id = episode.id;
  videoEpisodeResponseDto.name = episode.name;
  videoEpisodeResponseDto.description = episode.description;
  videoEpisodeResponseDto.airDate = episode.airDate.toISOString();
  videoEpisodeResponseDto.duration = episode.duration;
  videoEpisodeResponseDto.fileUrl = episode.fileUrl;

  return videoEpisodeResponseDto;
};

export const mapFromEpisodesToVideoEpisodeResponseDtos = (
  episodes: Episode[],
): VideoEpisodeResponseDto[] => {
  return episodes.map((episode) =>
    mapFromEpisodeToVideoEpisodeResponseDto(episode),
  );
};
