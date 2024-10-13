import { Knex } from 'knex';
import { UpdateUserDto } from './dto';
import { InjectKnex } from 'nestjs-knex';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../auth/entities/users.entity';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';

@Injectable()
export class UsersRepository {
  constructor(@InjectKnex() readonly knex: Knex) {}

  async getById(id: number) {
    return await this.knex('users').where({ id }).first();
  }

  async getByIdWithOrg(id: number) {
    return await this.knex('organization_users as ou')
      .join('organizations as o', 'ou.org_id', '=', 'o.id')
      .join('users as u', 'ou.user_id', '=', 'u.id')
      .select(
        'ou.user_id',
        'ou.org_id',
        'u.name',
        'u.username',
        'u.role',
        'o.name as org_name',
      )
      .where('ou.user_id', id)
      .andWhere('ou.is_deleted', false)
      .andWhere('u.is_deleted', false)
      .first();
  }

  async getOrgUsers(orgId: number, { page, limit }: QueryPagination) {
    return await this.knex('organization_users as ou')
      .join('users as u', 'ou.user_id', '=', 'u.id')
      .join('organizations as o', 'ou.org_id', '=', 'o.id')
      .select(
        'u.id',
        'u.name',
        'u.username',
        'u.role',
        this.knex.raw(`
        json_build_object(
        'id', 'o.id',
        'name', 'o.name'
        ) AS organization
        `),
      )
      .where('ou.org_id', orgId)
      .andWhere('ou.is_deleted', false)
      .andWhere('u.is_deleted', false)
      .orderBy('ou.created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
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

  async deleteUser(id: number) {
    return await this.knex.transaction(async (trn) => {
      try {
        await trn('organization_users')
          .where({ user_id: id })
          .update({ is_deleted: true });

        await trn('users').where({ id }).update({ is_deleted: true });

        await trn.commit();
      } catch (error) {
        await trn.rollback();
        throw error;
      }
    });
  }
}
