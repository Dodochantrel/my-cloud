import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  Res,
  UseInterceptors,
  Body,
  Query,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { Response } from 'express';
import { PictureRequestDto } from './dto/picture-request.dto';
import { WidthOptions } from 'src/files/files.manager';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPicture(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: PictureRequestDto,
  ) {
    return this.picturesService.uploadPictures(
      files,
      tokenPayload.id,
      dto.categoriesId,
    );
  }

  @Get('categories/:categoryId')
  async getPicturesByCategory(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('categoryId') categoryId: number,
  ) {
    return this.picturesService.getPicturesByCategory(categoryId);
  }

  @Get(':id')
  async getPictureById(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: number,
    @Res() res: Response,
    @Query('width') width?: WidthOptions,
  ) {
    return res.sendFile(
      await this.picturesService.getFileById(tokenPayload.groupsId, id, width),
    );
  }
}
