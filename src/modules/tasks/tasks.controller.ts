import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyTokenGuard } from '../shared/guards/verify.token.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { setMetadataKey } from 'src/common/constatns/consts';
import { User } from 'src/common/decorators/user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { IUserInRequest } from '../shared/types/interface';
import { QueryPagination } from 'src/common/utilis/pagination';
import { Role } from '../users/entities/user.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(VerifyTokenGuard, RoleGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks/:id')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task by id' })
  getById(@Param('id') id: string) {
    return this.tasksService.getById(+id);
  }

  @Get('projects/:projectId/tasks')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks for project' })
  getProjectTasks(
    @Param('projectId') id: string,
    @Query() query: QueryPagination,
  ) {
    return this.tasksService.getProjectTasks(+id, query);
  }

  @Post('tasks')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create task' })
  create(@User() user: IUserInRequest, @Body() body: CreateTaskDto) {
    return this.tasksService.create(body, user);
  }

  @Put('tasks')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task' })
  update(@User() user: IUserInRequest, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(body, user);
  }

  @Delete('tasks/:id')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task' })
  delete(@Param('id') id: string) {
    return this.tasksService.delete(+id);
  }
}
