import { Knex } from 'knex';
import { UpdateUserDto } from './dto';
import { InjectKnex } from 'nestjs-knex';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../auth/entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectKnex() readonly knex: Knex) {}

  async getById(id: number) {
    return await this.knex('users').where({ id }).first();
  }

  async getByUsername(username: string) {
    return await this.knex('users').where({ username }).first();
  }

  async createUser(
    trn: Knex.Transaction,
    data: Pick<
      UserEntity,
      'name' | 'role' | 'created_by' | 'password' | 'username'
    >,
  ): Promise<UserEntity[]> {
    return await trn('users')
      .insert({
        name: data.name,
        role: data.role,
        created_by: data.created_by,
        password: data.password,
        username: data.username,
      })
      .returning('*');
  }

  async updateUser(body: UpdateUserDto) {
    return await this.knex('users')
      .where({ id: body.user_id })
      .update({ name: body.name, role: body.role })
      .returning('*');
  }

  async deleteUser(data: { trn: Knex.Transaction; id: number }) {
    return await data
      .trn('users')
      .where({ id: data.id })
      .update({ is_deleted: true });
  }
}
