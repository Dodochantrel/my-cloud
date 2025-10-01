import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    description: `User's email`,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: `User's first name`,
    required: true,
  })
  firstName: string;

  @ApiProperty({
    description: `User's last name`,
    required: true,
  })
  lastName: string;

  @ApiProperty({
    description: `Access token for authentication`,
    required: true,
  })
  accessToken?: string;

  @ApiProperty({
    description: `Refresh token for obtaining new access tokens`,
    required: true,
  })
  refreshToken?: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}

export const mapFromUserToLoginResponseDto = (user: User, accessToken: string, refreshToken?: string): LoginResponseDto => {
  return new LoginResponseDto({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    accessToken,
    refreshToken,
  });
};
