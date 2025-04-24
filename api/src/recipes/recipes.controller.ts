import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RecipeRequestDto } from './dtos/recipe-request.dto';
import {
  mapFromRecipesToRecipesResponseDto,
  mapFromRecipeToRecipeResponseDto,
  RecipeResponseDto,
} from './dtos/recipe-response.dto';
import { Recipe } from './recipe.entity';
import { User } from 'src/users/user.entity';
import { Group } from 'src/groups/group.entity';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipeFileResponseDto } from './dtos/recipe-file-request.dto';
import { Response } from 'express';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiBody({
    description: 'Create a new recipe',
    type: RecipeRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The recipe has been successfully created.',
    type: RecipeResponseDto,
  })
  async createRecipe(
    @Body() dto: RecipeRequestDto,
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<RecipeResponseDto> {
    return mapFromRecipeToRecipeResponseDto(
      await this.recipesService.save(
        new Recipe({
          name: dto.name,
          description: dto.description,
          type: dto.type,
          user: new User({ id: tokenPayload.id }),
          groups: dto.groupsId.map((groupId) => new Group({ id: groupId })),
        }),
      ),
    );
  }

  @Get()
  @ApiPaginatedResponse(
    RecipeResponseDto,
    'The recipes have been successfully retrieved.',
  )
  async getMy(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query() params: QueryGetWithParamsDto,
    @Query('type') type: string,
  ): Promise<PaginatedResponse<RecipeResponseDto>> {
    const paginatedResponse = await this.recipesService.getMy(
      tokenPayload.id,
      tokenPayload.groupsId,
      new PageQuery(params.page, params.limit),
      type,
      params.search,
    );
    return new PaginatedResponse<RecipeResponseDto>(
      mapFromRecipesToRecipesResponseDto(paginatedResponse.data),
      new PageQuery(params.page, params.limit),
      paginatedResponse.meta.itemCount,
    );
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Upload a file',
    type: RecipeFileResponseDto,
  })
  async uploadFile(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: RecipeFileResponseDto,
    @Res() res: Response,
  ) {
    return res.sendFile(
      await this.recipesService.uploadFile(file, dto.id, tokenPayload.id),
    );
  }

  @Get('files/:id')
  async getFile(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return res.sendFile(
      await this.recipesService.getFile(Number(id), tokenPayload.id),
    );
  }

  @Patch('files/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return res.sendFile(
      await this.recipesService.updateFile(Number(id), tokenPayload.id, file),
    );
  }
}
