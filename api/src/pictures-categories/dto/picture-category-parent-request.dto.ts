import { ApiProperty } from '@nestjs/swagger';

export class PicturesCategoryParentRequestDto {
  @ApiProperty({
    description: 'The ID of the parent category',
    example: 1,
    required: false,
  })
  parentId: string | null;
}
