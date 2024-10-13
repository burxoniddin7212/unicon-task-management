import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Injectable } from '@nestjs/common';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';

@Injectable()
export class OrganizationsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getById(id: number) {
    return await this.knex('organizations')
      .where({ id, is_deleted: false })
      .first();
  }

  async getAll({ limit, page }: QueryPagination) {
    return await this.knex('organizations')
      .where({ is_deleted: false })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async create(createdBy: number, name: string) {
    return await this.knex('organizations')
      .insert({
        name,
        created_by: createdBy,
      })
      .returning('*');
  }

  async update(id: number, name: string) {
    return await this.knex('organizations')
      .where({ id })
      .update({ name })
      .returning(`*`);
  }

  async delete(id: number) {
    return await this.knex('organizations')
      .where({ id })
      .update({ is_deleted: true });
  }
}
