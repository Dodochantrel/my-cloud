import { ApiProperty } from '@nestjs/swagger';
import { PicturesCategory } from '../pictures-category.entity';

export class PicturesCategoryResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the pictures category',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the pictures category',
    example: 'Nature',
  })
  name: string;

  @ApiProperty({
    description: 'The childrens of the pictures category',
    type: () => PicturesCategoryResponseDto,
    isArray: true,
  })
  childrens: PicturesCategoryResponseDto[];
}

export const mapFromPicturesCategoryToResponseDto = (
  picturesCategory: PicturesCategory,
): PicturesCategoryResponseDto => {
  const responseDto = new PicturesCategoryResponseDto();
  responseDto.id = picturesCategory.id;
  responseDto.name = picturesCategory.name;
  responseDto.childrens = picturesCategory.childrens
    ? mapFromPicturesCategoriesToResponseDtos(picturesCategory.childrens)
    : undefined;
  return responseDto;
};

export const mapFromPicturesCategoriesToResponseDtos = (
  picturesCategories: PicturesCategory[],
): PicturesCategoryResponseDto[] => {
  return picturesCategories.map(mapFromPicturesCategoryToResponseDto);
};
