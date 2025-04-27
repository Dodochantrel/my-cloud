import { VideoProvider } from '../class/video';

export interface VideoProviderDto {
  id: number;
  fileUrl: string;
  name: string;
}

export const mapFromVideoProviderDtoToVideoProvider = (
  videoProviderDto: VideoProviderDto
): VideoProvider => {
  return {
    id: videoProviderDto.id,
    fileUrl: videoProviderDto.fileUrl,
    name: videoProviderDto.name,
  };
};

export const mapFromVideoProviderDtosToVideoProviders = (
  videoProviderDtos: VideoProviderDto[]
): VideoProvider[] => {
  return videoProviderDtos.map((videoProviderDto) =>
    mapFromVideoProviderDtoToVideoProvider(videoProviderDto)
  );
};
