import { ApiProperty } from '@nestjs/swagger';
import { VideoProvider } from '../interfaces/provider.interface';

export class VideoProviderResponseDto {
  @ApiProperty({
    description: 'ID of the video provider',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'File URL of the video provider',
    example: 'https://example.com/video.mp4',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Name of the video provider',
    example: 'Netflix',
  })
  name: string;
}

export const mapFromVideoProviderToVideoProviderResponseDto = (
  videoProvider: VideoProvider,
): VideoProviderResponseDto => {
  return {
    id: videoProvider.id,
    fileUrl: videoProvider.fileUrl,
    name: videoProvider.name,
  };
};

export const mapFromVideoProvidersToVideoProviderResponseDtos = (
  videoProviders: VideoProvider[],
): VideoProviderResponseDto[] => {
  return videoProviders.map((videoProvider) =>
    mapFromVideoProviderToVideoProviderResponseDto(videoProvider),
  );
};
