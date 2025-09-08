import { ApiProperty } from '@nestjs/swagger';

export class PicturesCategoryRequestDto {
  @ApiProperty({
    description: 'The name of the pictures category',
    example: 'Nature',
  })
  name: string;

  @ApiProperty({
    description: 'The ID of the parent category',
    example: 1,
    required: false,
  })
  parentId: string | null;

  @ApiProperty({
    description: 'An array of group IDs associated with this category',
    example: [1, 2, 3],
    required: false,
  })
  groupsId?: string[];
}
