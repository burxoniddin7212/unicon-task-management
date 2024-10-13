import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { IUserInRequest } from '../shared/types/interface';
import { TaskEntity } from './entities/task.entity';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';

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
  ): Promise<TaskEntity[]> {
    const task: TaskEntity[] = await this.knex(this.tableName)
      .where({ project_id: id })
      .where({ is_deleted: false })
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));

    return task;
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

  async delete(id: number) {
    return await this.knex(this.tableName)
      .where({ id })
      .update({ is_deleted: true });
  }
}
