import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TASK_STATUS } from '../enums/task-status.enum';

export class ChangeTaskStatuskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Task status', example: TASK_STATUS.IN_PROCESS })
  status: TASK_STATUS;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Task id', example: 1 })
  task_id: number;
}
