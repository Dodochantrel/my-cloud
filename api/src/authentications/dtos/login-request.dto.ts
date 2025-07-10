import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
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
    description: `Remember me option`,
    required: true,
  })
  rememberMe: boolean;
}
