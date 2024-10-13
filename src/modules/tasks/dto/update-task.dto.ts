import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'task id', example: 1 })
  task_id: number;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'deadline', example: '2024-10-15 23:59:59' })
  due_date?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'worker user id', example: 1 })
  worker_user_id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'About task', example: 'bekkind qismini qil' })
  name?: string;
}
