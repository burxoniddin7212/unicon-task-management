import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { ChangeTaskStatuskDto, CreateTaskDto, UpdateTaskDto } from './dto';
import { IUserInRequest } from '../shared/types/interface';
import { TaskEntity } from './entities/task.entity';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';
import { GetUserTasksByStatusQuery } from './dto/user.tasks.by.status.query';
import {
  ITaskWithTotal,
  IProjectWithTasksForUser,
} from './interfaces/tasks.interfaces';

@Injectable()
export class TasksRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  tableName = 'tasks';

  async getById(id: number): Promise<TaskEntity> {
    const task: TaskEntity = await this.knex(this.tableName)
      .where({ id })
      .where({ is_deleted: false })
      .select('*')
      .first();

    return task;
  }

  async getProjectTasks(
    id: number,
    { page, limit }: QueryPagination,
  ): Promise<ITaskWithTotal[]> {
    return await this.knex(this.tableName)
      .where({ project_id: id })
      .where({ is_deleted: false })
      .select('*')
      .select(this.knex.raw(`count(id) over() as total`))
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async getProjectsWithTasksForUser(
    userId: number,
    { page, limit }: QueryPagination,
  ): Promise<IProjectWithTasksForUser[]> {
    const knex = this.knex;
    return await this.knex('projects as p')
      .select(
        'p.id as project_id',
        'p.name as project_name',
        this.knex.raw(`JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'status', t.status,
              'due_date', t.due_date,
              'done_at', t.done_at,
              'created_at', t.created_at
          )
      ) AS tasks`),
      )
      .select(this.knex.raw(`count(p.id) over() as total`))
      .join('tasks as t', function () {
        this.on('t.project_id', '=', 'p.id')
          .andOn('t.worker_user_id', '=', knex.raw('?', [userId]))
          .andOn('t.is_deleted', '=', knex.raw('?', [false]));
      })
      .where('p.is_deleted', false)
      .groupBy('p.id', 'p.name')
      .orderBy('p.created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async getUserTasksByStatus(
    userId: number,
    { page, limit, status }: GetUserTasksByStatusQuery,
  ): Promise<ITaskWithTotal[]> {
    return await this.knex(this.tableName)
      .select('*')
      .select(this.knex.raw(`count(id) over() as total`))
      .where({ worker_user_id: userId })
      .where({ status: status })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async create(
    body: CreateTaskDto,
    currentUser: Pick<IUserInRequest, 'id' | 'org_id'>,
    trx?: Knex.Transaction,
  ): Promise<TaskEntity[]> {
    const knex = trx ?? this.knex;

    const { due_date, name, project_id, worker_user_id } = body;

    const dataToInsert: Omit<
      TaskEntity,
      'id' | 'created_at' | 'status' | 'is_deleted'
    > = {
      created_by: currentUser.id,
      name,
      project_id,
      worker_user_id,
      due_date,
    };

    return await knex(this.tableName).insert(dataToInsert).returning('*');
  }

  async update(
    body: UpdateTaskDto,
    trx?: Knex.Transaction,
  ): Promise<TaskEntity[]> {
    const knex = trx ?? this.knex;

    const { due_date, name, worker_user_id, task_id } = body;

    const dataToUpdate: Partial<
      Pick<TaskEntity, 'name' | 'worker_user_id' | 'due_date'>
    > = {
      ...(name && { name }),
      ...(worker_user_id && { worker_user_id }),
      ...(due_date && { due_date }),
    };

    return await knex(this.tableName)
      .where({ id: task_id })
      .update(dataToUpdate)
      .returning('*');
  }

  async changeTaskStatus(
    body: ChangeTaskStatuskDto,
    taskDoneDate: Date | null,
  ): Promise<TaskEntity[]> {
    return await this.knex(this.tableName)
      .where({ id: body.task_id })
      .update({ status: body.status, done_at: taskDoneDate })
      .returning('*');
  }

  async delete(id: number): Promise<void> {
    return await this.knex(this.tableName)
      .where({ id })
      .update({ is_deleted: true });
  }
}
