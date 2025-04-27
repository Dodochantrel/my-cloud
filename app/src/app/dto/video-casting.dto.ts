import { Casting } from '../class/video';

export interface VideoCastingDto {
  id: number;
  name: string;
  popularity: number;
  character: string;
  order: number;
  fileUrl: string;
}

export const mapFromVideoCastingDtoToVideoCasting = (
  videoCastingDto: VideoCastingDto
): Casting => {
  return {
    id: videoCastingDto.id,
    name: videoCastingDto.name,
    popularity: videoCastingDto.popularity,
    character: videoCastingDto.character,
    order: videoCastingDto.order,
    fileUrl: videoCastingDto.fileUrl,
  };
};

export const mapFromVideoCastingDtosToVideoCastings = (
  videoCastingDtos: VideoCastingDto[]
): Casting[] => {
  return videoCastingDtos.map((videoCastingDto) =>
    mapFromVideoCastingDtoToVideoCasting(videoCastingDto)
  );
};
