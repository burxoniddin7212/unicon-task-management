import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name', example: 'Asra.uz' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'project id', example: 1 })
  id: number;
}
