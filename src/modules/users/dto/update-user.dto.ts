import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Role } from '../enums/user-role-enum';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name', example: 'jamshid' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([Role.CHIEF, Role.STAFF])
  @ApiProperty({ description: 'role', example: Role.STAFF })
  role: Role.CHIEF | Role.STAFF;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'user_id', example: 1 })
  user_id: number;
}
