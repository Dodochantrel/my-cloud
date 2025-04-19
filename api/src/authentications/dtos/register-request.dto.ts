import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({
    description: `User's email`,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: `User's password`,
    required: true,
  })
  password: string;

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
}
