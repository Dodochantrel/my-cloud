import { Body, Controller, Get, Post } from '@nestjs/common';
import { PicturesCategoriesService } from './pictures-categories.service';
import {
  mapFromPicturesCategoriesToResponseDtos,
  mapFromPicturesCategoryToResponseDto,
  PicturesCategoryResponseDto,
} from './dto/pictures-category-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { PicturesCategoryRequestDto } from './dto/pictures-category-request.dto';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { PicturesCategory } from './pictures-category.entity';
import { User } from 'src/users/user.entity';
import { Group } from 'src/groups/group.entity';

@Controller('pictures-categories')
export class PicturesCategoriesController {
  constructor(
    private readonly picturesCategoriesService: PicturesCategoriesService,
  ) {}

  @Post()
  @ApiBody({
    type: PicturesCategoryRequestDto,
    description: 'Create a new pictures category',
  })
  @ApiResponse({
    status: 201,
    description: 'The pictures category has been successfully created.',
    type: PicturesCategoryResponseDto,
  })
  async create(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: PicturesCategoryRequestDto,
  ): Promise<PicturesCategoryResponseDto> {
    return mapFromPicturesCategoryToResponseDto(
      await this.picturesCategoriesService.save(
        new PicturesCategory({
          name: dto.name,
          user: new User({ id: tokenPayload.id }),
          parent: dto.parentId
            ? new PicturesCategory({ id: dto.parentId })
            : undefined,
          groups: dto.groupsId
            ? dto.groupsId.map((groupId) => new Group({ id: groupId }))
            : [],
        }),
      ),
    );
  }

  @Get()
  async getMy(
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<PicturesCategoryResponseDto[]> {
    return mapFromPicturesCategoriesToResponseDtos(
      await this.picturesCategoriesService.findMy(
        tokenPayload.id,
        tokenPayload.groupsId,
      ),
    );
  }
}
