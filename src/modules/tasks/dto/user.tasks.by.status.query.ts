import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QueryPagination } from 'src/common/utilis/pagination';
import { TASK_STATUS } from '../enums/task-status.enum';

export class GetUserTasksByStatusQuery extends QueryPagination {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tasks status',
    example: TASK_STATUS.CREATED,
    enum: TASK_STATUS,
  })
  @IsEnum(TASK_STATUS, { always: true })
  status: TASK_STATUS;
}
