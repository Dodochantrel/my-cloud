import { ApiProperty } from '@nestjs/swagger';

export class VideoDirectorResponseDto {
  @ApiProperty({
    description: 'The id of the director',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the director',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The file url of the director',
    example: 'https://example.com/image.jpg',
  })
  fileUrl: string;
}

export const mapFromDirectorToVideoDirectorResponseDto = (
  director: VideoDirectorResponseDto,
): VideoDirectorResponseDto => {
  return {
    id: director.id,
    name: director.name,
    fileUrl: director.fileUrl,
  };
};

export const mapFromDirectorsToVideoDirectorResponseDtos = (
  directors: VideoDirectorResponseDto[],
): VideoDirectorResponseDto[] => {
  return directors.map((director) =>
    mapFromDirectorToVideoDirectorResponseDto(director),
  );
};
