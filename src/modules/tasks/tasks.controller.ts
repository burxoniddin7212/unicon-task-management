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
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyTokenGuard } from '../shared/guards/verify.token.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  ChangeTaskStatuskDto,
  CreateTaskDto,
  UpdateTaskDto,
  GetUserTasksByStatusQuery,
} from './dto';
import { IUserInRequest } from '../shared/types/interface';
import { QueryPagination } from 'src/common/utilis/pagination';
import { Role } from '../users/enums/user-role-enum';
import { Roles } from 'src/common/decorators/role.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(VerifyTokenGuard, RoleGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks/:id')
  @Roles(Role.CHIEF, Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task by id' })
  getById(@Param('id') id: string) {
    return this.tasksService.getById(+id);
  }

  @Get('projects/:projectId/tasks')
  @Roles(Role.CHIEF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks for project' })
  getProjectTasks(
    @Param('projectId') id: string,
    @Query() query: QueryPagination,
  ) {
    return this.tasksService.getProjectTasks(+id, query);
  }

  @Get('projects/tasks/for-user')
  @Roles(Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get projects with tasks for user' })
  getProjectsWithTasksForUser(
    @User() user: IUserInRequest,
    @Query() query: QueryPagination,
  ) {
    return this.tasksService.getProjectsWithTasksForUser(user.id, query);
  }

  @Get('user/tasks/by-status')
  @Roles(Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user tasks by status' })
  getUserTasksByStatus(
    @User() user: IUserInRequest,
    @Query() query: GetUserTasksByStatusQuery,
  ) {
    return this.tasksService.getUserTasksByStatus(user.id, query);
  }

  @Post('tasks')
  @Roles(Role.CHIEF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create task' })
  create(@User() user: IUserInRequest, @Body() body: CreateTaskDto) {
    return this.tasksService.create(body, user);
  }

  @Put('tasks/change-status')
  @Roles(Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Task change status' })
  changeTaskStatus(
    @User() user: IUserInRequest,
    @Body() body: ChangeTaskStatuskDto,
  ) {
    return this.tasksService.changeTaskStatus(body, user);
  }

  @Put('tasks')
  @Roles(Role.CHIEF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task' })
  update(@User() user: IUserInRequest, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(body, user);
  }

  @Delete('tasks/:id')
  @Roles(Role.CHIEF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task' })
  delete(@Param('id') id: string) {
    return this.tasksService.delete(+id);
  }
}
