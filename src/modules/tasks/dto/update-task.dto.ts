import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTaskDto {
  @IsNumber()
  @ApiProperty({ description: 'task id', example: 1 })
  @IsNotEmpty()
  task_id: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'deadline', example: '2024-10-15 23:59:59' })
  due_date?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'worker user id', example: 1 })
  worker_user_id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'About task', example: 'bekkind qismini qil' })
  name?: string;
}
