import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { ChangeTaskStatuskDto, CreateTaskDto, UpdateTaskDto } from './dto';
import { IUserInRequest } from '../shared/types/interface';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { QueryPagination } from 'src/common/utilis/pagination';
import { GetUserTasksByStatusQuery } from './dto/user.tasks.by.status.query';
import { UserEntity } from '../users/entities/user.entity';
import { TASK_STATUS } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly userService: UsersService,
    private readonly projectService: ProjectsService,
  ) {}

  async getById(id: number) {
    const task = await this.tasksRepository.getById(id);

    if (!task) throw new NotFoundException(HTTP_MESSAGES.TASKS_NOT_FOUND);

    return { message: HTTP_MESSAGES.OK, data: task };
  }

  async getProjectTasks(id: number, query: QueryPagination) {
    await this.projectService.getById(id);

    const tasks = await this.tasksRepository.getProjectTasks(id, query);

    return {
      message: HTTP_MESSAGES.OK,
      data: { data: tasks, total: tasks[0]?.total || 0 },
    };
  }

  async getProjectsWithTasksForUser(userId: number, query: QueryPagination) {
    const projectsWithTasksForUser =
      await this.tasksRepository.getProjectsWithTasksForUser(userId, query);

    return {
      message: HTTP_MESSAGES.OK,
      data: {
        data: projectsWithTasksForUser,
        total: projectsWithTasksForUser[0]?.total || 0,
      },
    };
  }

  async getUserTasksByStatus(userId: number, query: GetUserTasksByStatusQuery) {
    const userTasksByStatus = await this.tasksRepository.getUserTasksByStatus(
      userId,
      query,
    );

    return {
      message: HTTP_MESSAGES.OK,
      data: {
        data: userTasksByStatus,
        total: userTasksByStatus[0]?.total || 0,
      },
    };
  }

  async create(
    body: CreateTaskDto,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
  ) {
    await Promise.all([
      this.checkProject(body, currentUser),
      this.checkWorkerUser(body, currentUser),
    ]);

    const [createdTask] = await this.tasksRepository.create(body, currentUser);

    return { message: HTTP_MESSAGES.OK, data: createdTask };
  }

  async update(
    body: UpdateTaskDto,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
  ) {
    const { worker_user_id } = body;
    await this.getById(body.task_id);

    if (worker_user_id) {
      await this.checkWorkerUser({ worker_user_id }, currentUser);
    }

    const [updatedTask] = await this.tasksRepository.update(body);

    return { message: HTTP_MESSAGES.UPDATED, data: updatedTask };
  }

  async changeTaskStatus(
    body: ChangeTaskStatuskDto,
    currentUser: Pick<UserEntity, 'id'>,
  ) {
    let taskDoneDate: Date | null;

    const check = await this.checkWorkerUserForTaskChangeStatus(
      body,
      currentUser,
    );

    if (body.status == TASK_STATUS.DONE) taskDoneDate = new Date();

    if (
      check.data.status == TASK_STATUS.DONE &&
      body.status != TASK_STATUS.DONE
    )
      taskDoneDate = null;

    const task = await this.tasksRepository.changeTaskStatus(
      body,
      taskDoneDate,
    );

    return { message: HTTP_MESSAGES.UPDATED, data: task };
  }

  async delete(id: number) {
    await this.getById(id);

    await this.tasksRepository.delete(id);

    return { message: HTTP_MESSAGES.DELETED, data: null };
  }

  async checkWorkerUserForTaskChangeStatus(
    params: ChangeTaskStatuskDto,
    currentUser: Pick<UserEntity, 'id'>,
  ) {
    const task = await this.getById(params.task_id);

    if (task.data.worker_user_id != currentUser.id)
      throw new BadRequestException(
        HTTP_MESSAGES.TASKS_STATUS_CHANGE_PERMISSION,
      );

    return task;
  }

  private async checkWorkerUser(
    params: Pick<CreateTaskDto, 'worker_user_id'>,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
  ) {
    const { worker_user_id } = params;
    const user = await this.userService.getById(worker_user_id);

    const orgOfUser = await this.userService.getUserOrgIdByUserId(user.data.id);

    if (!orgOfUser) {
      throw new BadRequestException(HTTP_MESSAGES.USERS_OR_ORG_USER_NOTFOUND);
    }

    if (orgOfUser.org_id !== currentUser.org_id) {
      throw new BadRequestException(HTTP_MESSAGES.TASKS_PERMISSION);
    }
  }

  private async checkProject(
    params: Pick<CreateTaskDto, 'project_id'>,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
  ) {
    const { project_id } = params;

    const project = await this.projectService.getById(project_id);

    if (project.data.org_id !== currentUser.org_id) {
      throw new BadRequestException(HTTP_MESSAGES.TASKS_CHANGE_PERMISSION);
    }
  }
}
