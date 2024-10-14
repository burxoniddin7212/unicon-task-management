import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Role } from '../enums/user-role-enum';

export class CreateUserForOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name', example: 'bobur' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'username', example: 'bobur7212' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password', example: 'password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([Role.CHIEF, Role.STAFF])
  @ApiProperty({ description: 'role', example: Role.STAFF })
  role: Role.CHIEF | Role.STAFF;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Organization id', example: 1 })
  org_id: number;
}
