import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum';

export class RoleResponseDto {
  @ApiProperty({
    description: 'The role',
    example: ['user'],
  })
  roles: string[];
}

export const mapFromRoleToRoleResponseDto = (role: Role[]): RoleResponseDto => {
  return {
    roles: role.map((r) => r.toString()),
  };
};
