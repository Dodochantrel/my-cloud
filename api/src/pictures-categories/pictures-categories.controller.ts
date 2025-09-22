import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { PicturesCategoryParentRequestDto } from './dto/picture-category-parent-request.dto';
import { AuthGuard } from 'src/authentications/auth.guard';

@Controller('pictures-categories')
export class PicturesCategoriesController {
  constructor(
    private readonly picturesCategoriesService: PicturesCategoriesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBody({
    type: PicturesCategoryRequestDto,
    description: 'Update an existing pictures category',
  })
  @ApiResponse({
    status: 200,
    description: 'The pictures category has been successfully updated.',
    type: PicturesCategoryResponseDto,
  })
  async update(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: PicturesCategoryRequestDto,
    @Param('id') id: string,
  ): Promise<PicturesCategoryResponseDto> {
    return mapFromPicturesCategoryToResponseDto(
      await this.picturesCategoriesService.update(
        id,
        dto.name,
        dto.groupsId ? dto.groupsId : [],
      ),
    );
  }

  @Get()
  @UseGuards(AuthGuard)
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

  @Patch(':id/parent')
  @UseGuards(AuthGuard)
  @ApiBody({
    type: PicturesCategoryParentRequestDto,
    description: 'Update the parent of an existing pictures category',
  })
  @ApiResponse({
    status: 200,
    description:
      'The parent of the pictures category has been successfully updated.',
    type: PicturesCategoryResponseDto,
  })
  async changeParent(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: PicturesCategoryParentRequestDto,
    @Param('id') id: string,
  ): Promise<PicturesCategoryResponseDto> {
    return mapFromPicturesCategoryToResponseDto(
      await this.picturesCategoriesService.changeParent(
        id,
        tokenPayload.id,
        dto.parentId,
      ),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The pictures category has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.picturesCategoriesService.delete(id);
  }
}
