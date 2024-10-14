import { Knex } from 'knex';
import { UpdateUserDto } from './dto';
import { InjectKnex } from 'nestjs-knex';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectKnex() readonly knex: Knex) {}

  tableName = 'users';

  async getById(id: number): Promise<UserEntity> {
    return await this.knex('users').select('*').where({ id }).first();
  }

  async getByUsername(username: string): Promise<UserEntity> {
    return await this.knex(this.tableName).where({ username }).first();
  }

  async createUser(
    trn: Knex.Transaction,
    data: Pick<
      UserEntity,
      'name' | 'role' | 'created_by' | 'password' | 'username'
    >,
  ): Promise<UserEntity[]> {
    return await trn(this.tableName)
      .insert({
        name: data.name,
        role: data.role,
        created_by: data.created_by,
        password: data.password,
        username: data.username,
      })
      .returning('*');
  }

  async updateUser(body: UpdateUserDto): Promise<UserEntity[]> {
    return await this.knex(this.tableName)
      .where({ id: body.user_id })
      .update({ name: body.name, role: body.role })
      .returning('*');
  }

  async deleteUser(id: number): Promise<void> {
    return await this.knex.transaction(async (trn) => {
      await trn('organization_users')
        .where({ user_id: id })
        .update({ is_deleted: true });

      await trn(this.tableName).where({ id: id }).update({ is_deleted: true });

      await trn('tasks')
        .where({ worker_user_id: id })
        .whereIn('status', ['CREATED', 'IN_PROCESS'])
        .update({ worker_user_id: null });
    });
  }
}
