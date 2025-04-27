import { ApiProperty } from '@nestjs/swagger';
import { Casting } from '../interfaces/casting.interface';

export class VideoCastingResponseDto {
  @ApiProperty({
    description: 'The id of the actor',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the actor',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The popularity of the actor',
    example: 10,
  })
  popularity: number;

  @ApiProperty({
    description: 'The character of the actor',
    example: 'John Doe',
  })
  character: string;

  @ApiProperty({
    description: 'The order of the actor',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'The file url of the actor',
    example: 'https://example.com/image.jpg',
  })
  fileUrl: string;
}

export const mapFromCastingToVideoCastingResponseDto = (
  casting: Casting,
): VideoCastingResponseDto => {
  return {
    id: casting.id,
    name: casting.name,
    popularity: casting.popularity,
    character: casting.character,
    order: casting.order,
    fileUrl: casting.fileUrl,
  };
};

export const mapFromCastingToVideoCastingResponseDtos = (
  castings: Casting[],
): VideoCastingResponseDto[] => {
  return castings.map((casting) =>
    mapFromCastingToVideoCastingResponseDto(casting),
  );
};
