import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  mapFromUsersToUsersResponseDto,
  UserResponseDto,
} from './dtos/user-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AccessTokenPayload, TokenPayload } from 'src/utils/tokens.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('minimal')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users with minimal information.',
    type: UserResponseDto,
    isArray: true,
  })
  async getMinimalUsers(
    @TokenPayload() tokenPayload: AccessTokenPayload,
  ): Promise<UserResponseDto[]> {
    return mapFromUsersToUsersResponseDto(
      await this.usersService.getMinimalUsers(tokenPayload.id),
    );
  }
}
