import { User } from '../class/user';
import { mapFromDtosToRoles, mapFromRoleDtoToRoles, RoleDto } from './role.dto';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAuthorized: boolean;
  roles: RoleDto | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export const mapFromUserDtoToUser = (dto: UserDto): User => {
  return new User(
    dto.id,
    dto.firstName,
    dto.lastName,
    dto.email,
    dto.isAuthorized,
    dto.roles ? mapFromRoleDtoToRoles(dto.roles) : [],
    dto.createdAt ? new Date(dto.createdAt) : null,
    dto.updatedAt ? new Date(dto.updatedAt) : null
  );
};

export const mapFromDtosToUsers = (dtos: UserDto[]): User[] => {
  return dtos.map((dto) => mapFromUserDtoToUser(dto));
};
