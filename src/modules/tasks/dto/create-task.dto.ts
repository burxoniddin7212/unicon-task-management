import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'project id', example: 1 })
  project_id: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'deadline', example: '2024-10-15 23:59:59' })
  due_date: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'worker user id', example: 1 })
  worker_user_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'About task', example: 'bekkind qismini qil' })
  name: string;
}
