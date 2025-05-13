import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { PageQuery } from 'src/pagination/page-query';
import { Group } from './group.entity';
import { GroupRequestDto } from './dtos/group-request.dto';
import {
  GroupResponseDto,
  mapFromGroupsToGroupsResponseDto,
  mapFromGroupToGroupResponseDto,
} from './dtos/group-response.dto';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AddOrRemoveUserGroupRequestDto } from './dtos/add-or-remove-user-group-request.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiPaginatedResponse(GroupResponseDto, 'Groups')
  async getAll(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Query() params: QueryGetWithParamsDto,
  ): Promise<PaginatedResponse<GroupResponseDto>> {
    const paginatedResponse = await this.groupsService.getMy(
      tokenPayload.id,
      new PageQuery(params.page, params.limit),
      params.search,
    );
    return new PaginatedResponse<GroupResponseDto>(
      mapFromGroupsToGroupsResponseDto(paginatedResponse.data),
      new PageQuery(params.page, params.limit),
      paginatedResponse.meta.itemCount,
    );
  }

  @Get('minimal')
  @ApiResponse({
    status: 200,
    description: 'Minimal data of groups',
    type: GroupResponseDto,
    isArray: true,
  })
  async getMinimalData(@TokenPayload() tokenPayload: AccessTokenPayload) {
    return mapFromGroupsToGroupsResponseDto(
      await this.groupsService.getMyMinimalData(tokenPayload.id),
    );
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: GroupResponseDto,
  })
  async create(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: GroupRequestDto,
  ): Promise<GroupResponseDto> {
    return mapFromGroupToGroupResponseDto(
      await this.groupsService.save(
        tokenPayload.id,
        new Group({
          name: dto.name,
        }),
        dto.usersId,
      ),
    );
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Group updated successfully',
    type: GroupResponseDto,
  })
  async update(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Body() dto: GroupRequestDto,
    @Param('id') id: string,
  ): Promise<GroupResponseDto> {
    return mapFromGroupToGroupResponseDto(
      await this.groupsService.update(
        tokenPayload.id,
        new Group({
          id: Number(id),
          name: dto.name,
        }),
        dto.usersId,
      ),
    );
  }

  @Post(':id/add-user')
  @ApiResponse({
    status: 200,
    description: 'Users added to group successfully',
    type: GroupResponseDto,
  })
  @ApiBody({
    description: 'Users id to add to group',
    type: AddOrRemoveUserGroupRequestDto,
  })
  async addUsers(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
    @Body() dto: AddOrRemoveUserGroupRequestDto,
  ): Promise<GroupResponseDto> {
    return mapFromGroupToGroupResponseDto(
      await this.groupsService.addUser(tokenPayload.id, Number(id), dto.userId),
    );
  }

  @Post(':id/remove-user')
  @ApiResponse({
    status: 200,
    description: 'Users removed from group successfully',
    type: GroupResponseDto,
  })
  @ApiBody({
    description: 'Users id to remove from group',
    type: AddOrRemoveUserGroupRequestDto,
  })
  async removeUsers(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
    @Body() dto: AddOrRemoveUserGroupRequestDto,
  ): Promise<GroupResponseDto> {
    return mapFromGroupToGroupResponseDto(
      await this.groupsService.removeUser(
        tokenPayload.id,
        Number(id),
        dto.userId,
      ),
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Group deleted successfully',
  })
  async delete(
    @TokenPayload() tokenPayload: AccessTokenPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.groupsService.delete(tokenPayload.id, Number(id));
  }
}
