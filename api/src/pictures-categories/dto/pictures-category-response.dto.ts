import { ApiProperty } from '@nestjs/swagger';
import { PicturesCategory } from '../pictures-category.entity';
import {
  GroupResponseDto,
  mapFromGroupsToGroupsResponseDto,
} from 'src/groups/dtos/group-response.dto';

export class PicturesCategoryResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the pictures category',
    example: '1',
  })
  id: string;

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

  @ApiProperty({
    description: 'The groups associated with the pictures category',
    type: () => GroupResponseDto,
    isArray: true,
    required: false,
  })
  groups?: GroupResponseDto[];
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
  responseDto.groups = picturesCategory.groups
    ? mapFromGroupsToGroupsResponseDto(picturesCategory.groups)
    : undefined;
  return responseDto;
};

export const mapFromPicturesCategoriesToResponseDtos = (
  picturesCategories: PicturesCategory[],
): PicturesCategoryResponseDto[] => {
  return picturesCategories.map(mapFromPicturesCategoryToResponseDto);
};
