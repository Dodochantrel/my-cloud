import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { Response } from 'express';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPicture(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ) {
    return this.picturesService.uploadPictures(files, tokenPayload.id);
  }

  @Get('categories/:categoryId')
  async getPicturesByCategory(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('categoryId') categoryId: number,
  ) {
    return this.picturesService.getPicturesByCategory(
      tokenPayload.groupsId,
      categoryId,
    );
  }

  @Get(':id')
  async getPictureById(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return res.sendFile(
      await this.picturesService.getFileById(tokenPayload.groupsId, id),
    );
  }
}
