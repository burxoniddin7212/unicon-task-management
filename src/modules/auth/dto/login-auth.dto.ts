import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'username', example: 'username' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password', example: 'password' })
  password: string;
}
