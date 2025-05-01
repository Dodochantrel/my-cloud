import { User } from '../class/user';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const mapFromUserDtoToUser = (dto: UserDto): User => {
  return new User(
    dto.id,
    dto.firstName,
    dto.lastName,
    dto.email,
    new Date(dto.createdAt),
    new Date(dto.updatedAt)
  );
};

export const mapFromDtosToUsers = (dtos: UserDto[]): User[] => {
  return dtos.map((dto) => mapFromUserDtoToUser(dto));
};
