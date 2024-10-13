import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { IUserInRequest } from '../shared/types/interface';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { TaskEntity } from './entities/task.entity';
import { QueryPagination } from 'src/common/utilis/pagination';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly userService: UsersService,
    private readonly projectService: ProjectsService,
  ) {}

  async getById(id: number) {
    const task: TaskEntity = await this.tasksRepository.getById(id);

    if (!task) throw new NotFoundException(HTTP_MESSAGES.TASKS_NOT_FOUND);

    return { message: HTTP_MESSAGES.OK, data: task };
  }

  async getProjectTasks(id: number, query: QueryPagination) {
    await this.projectService.getById(id);

    const tasks: TaskEntity[] = await this.tasksRepository.getProjectTasks(
      id,
      query,
    );

    return { message: HTTP_MESSAGES.OK, data: tasks };
  }

  async create(
    body: CreateTaskDto,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
  ) {
    await Promise.all([
      this.checkProject(body, currentUser),
      this.checkWorkerUser(body, currentUser),
    ]);

    const [createdTask]: TaskEntity[] = await this.tasksRepository.create(
      body,
      currentUser,
    );

    return { message: HTTP_MESSAGES.OK, data: createdTask };
  }

  async update(
    body: UpdateTaskDto,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
  ) {
    await this.getById(body.task_id);

    if (body?.worker_user_id) {
      const woworkerUserIdrk = { worker_user_id: body.worker_user_id };
      await this.checkWorkerUser(woworkerUserIdrk, currentUser);
    }

    const [updatedTask]: TaskEntity[] = await this.tasksRepository.update(body);

    return { message: HTTP_MESSAGES.UPDATED, data: updatedTask };
  }

  async delete(id: number) {
    await this.getById(id);

    await this.tasksRepository.delete(id);

    return { message: HTTP_MESSAGES.DELETED, data: null };
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
