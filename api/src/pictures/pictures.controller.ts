import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  Res,
  UseInterceptors,
  Query,
  Body,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { Response } from 'express';
import { WidthOptions } from 'src/files/files.manager';
import { PictureByCategoryResponseDto } from './dto/pictures-by-category-response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPicture(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() { categoryId }: { categoryId: string },
  ) {
    return this.picturesService.uploadPictures(
      files,
      tokenPayload.id,
      categoryId,
    );
  }

  @Get('categories/:categoryId')
  @ApiResponse({
    status: 200,
    description:
      'Returns the list of picture IDs and count in the specified category.',
    type: PictureByCategoryResponseDto,
  })
  async getPicturesByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<PictureByCategoryResponseDto> {
    const response =
      await this.picturesService.getPicturesByCategory(categoryId);
    return new PictureByCategoryResponseDto(response.ids, response.count);
  }

  @Get(':id')
  async getPictureById(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
    @Res() res: Response,
    @Query('width') width?: WidthOptions,
  ) {
    return res.sendFile(
      await this.picturesService.getFileById(tokenPayload.groupsId, id, width),
    );
  }
}
