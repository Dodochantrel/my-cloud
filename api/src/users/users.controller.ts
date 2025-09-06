import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  mapFromUsersToUsersResponseDto,
  mapFromUserToUserResponseDto,
  UserResponseDto,
} from './dtos/user-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';
import { UserAuthorizeRequestDto } from './dtos/user-authorize-request.dto';
import { Roles } from 'src/roles/role.decorateur';
import { Role } from 'src/roles/role.enum';
import {
  mapFromUsersToUsersMinimalResponseDto,
  UserMinimalResponseDto,
} from './dtos/user-minimal-response.dto';
import { ApiPaginatedResponse } from 'src/pagination/response-paginated.decorator';
import { QueryGetWithParamsDto } from 'src/pagination/query-get-with-params.dto';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('minimal')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users with minimal information.',
    type: UserMinimalResponseDto,
    isArray: true,
  })
  async getMinimalUsers(
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<UserMinimalResponseDto[]> {
    return mapFromUsersToUsersMinimalResponseDto(
      await this.usersService.getMinimalUsers(tokenPayload.id),
    );
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user with full information.',
    type: UserResponseDto,
  })
  async getMe(
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<UserResponseDto> {
    return mapFromUserToUserResponseDto(
      await this.usersService.getMe(tokenPayload.id),
    );
  }

  @Patch('authorize')
  @Roles(Role.Admin)
  @ApiResponse({
    status: 200,
    description: 'Authorizes the user and returns their information.',
    type: UserResponseDto,
  })
  @ApiBody({
    type: UserAuthorizeRequestDto,
    description: 'Request body to authorize a user.',
  })
  async authorizeUser(
    @Body() dto: UserAuthorizeRequestDto,
  ): Promise<UserResponseDto> {
    return mapFromUserToUserResponseDto(
      await this.usersService.authorize(dto.id, dto.isAuthorized),
    );
  }

  @Get()
  @Roles(Role.Admin)
  @ApiPaginatedResponse(
    UserResponseDto,
    'Returns a list of all users with full information.',
  )
  async getAllUsers(
    @Query() query: QueryGetWithParamsDto,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const response = await this.usersService.getAll(
      query.search,
      new PageQuery(query.page, query.limit),
    );
    return new PaginatedResponse<UserResponseDto>(
      mapFromUsersToUsersResponseDto(response.data),
      new PageQuery(query.page, query.limit),
      response.meta.itemCount,
    );
  }
}
