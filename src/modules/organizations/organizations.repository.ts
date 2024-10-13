import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Injectable } from '@nestjs/common';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';

@Injectable()
export class OrganizationsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  tableName = 'organizations';

  async getById(id: number) {
    return await this.knex(this.tableName)
      .where({ id, is_deleted: false })
      .select('*')
      .first();
  }

  async getAll({ limit, page }: QueryPagination) {
    return await this.knex(this.tableName)
      .where({ is_deleted: false })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async create(createdBy: number, name: string) {
    return await this.knex(this.tableName)
      .insert({
        name,
        created_by: createdBy,
      })
      .returning('*');
  }

  async update(id: number, name: string) {
    return await this.knex(this.tableName)
      .where({ id })
      .update({ name })
      .returning(`*`);
  }

  async delete(orgId: number) {
    return await this.knex.transaction(async (trn) => {
      await trn('organization_users')
        .where({ org_id: orgId })
        .update({ is_deleted: true });

      await trn('users')
        .whereIn(
          'id',
          trn('organization_users').select('user_id').where({ org_id: orgId }),
        )
        .update({ is_deleted: true });

      await trn('projects')
        .where({ org_id: orgId })
        .update({ is_deleted: true });

      await trn('tasks')
        .whereIn(
          'project_id',
          trn('projects').select('id').where({ org_id: orgId }),
        )
        .update({ is_deleted: true });

      await trn('organizations')
        .where({ id: orgId })
        .update({ is_deleted: true });
    });
  }
}
