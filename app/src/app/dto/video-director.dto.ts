import { Director } from "../class/video";

export interface VideoDirectorDto {
  id: number;
  name: string;
  fileUrl: string;
}

export const mapFromVideoDirectorDtoToVideoDirector = (
  videoDirectorDto: VideoDirectorDto
): Director => {
  return {
    id: videoDirectorDto.id,
    name: videoDirectorDto.name,
    fileUrl: videoDirectorDto.fileUrl,
  };
};

export const mapFromVideoDirectorDtosToVideoDirectors = (
  videoDirectorDtos: VideoDirectorDto[]
): Director[] => {
  return videoDirectorDtos.map((videoDirectorDto) =>
    mapFromVideoDirectorDtoToVideoDirector(videoDirectorDto)
  );
};
