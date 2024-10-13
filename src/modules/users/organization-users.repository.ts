import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';
import { OrganizationUserEntity } from './entities/organization-user.entity';

@Injectable()
export class OrganizationUsersRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  tableName = 'organization_users';

  async getByIdWithOrg(id: number) {
    const knex = this.knex;
    return await knex('organization_users as ou')
      .join('users as u', function () {
        this.on('ou.user_id', '=', 'u.id').andOn(
          'u.is_deleted',
          '=',
          knex.raw('?', [false]),
        );
      })
      .join('organizations as o', 'ou.org_id', '=', 'o.id')
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
      .first();
  }

  async getOrgUsers(orgId: number, { page, limit }: QueryPagination) {
    const knex = this.knex;

    return await knex('organization_users as ou')
      .join('users as u', function () {
        this.on('ou.user_id', '=', 'u.id').andOn(
          'u.is_deleted',
          '=',
          knex.raw('?', [false]),
        );
      })
      .join('organizations as o', 'ou.org_id', '=', 'o.id')
      .select(
        'u.id',
        'u.name',
        'u.username',
        'u.role',
        this.knex.raw(`
        json_build_object(
        'id', o.id,
        'name', o.name
        ) AS organization
        `),
      )
      .where('ou.org_id', orgId)
      .andWhere('ou.is_deleted', false)
      .orderBy('ou.created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async createOrgUser(data: {
    trn: Knex.Transaction;
    user_id: number;
    org_id: number;
  }) {
    return await data
      .trn('organization_users')
      .insert({
        org_id: data.org_id,
        user_id: data.user_id,
      })
      .returning('*');
  }

  async deleteOrgUser(data: { trn: Knex.Transaction; id: number }) {
    return await data
      .trn('organization_users')
      .where({ user_id: data.id })
      .update({ is_deleted: true });
  }

  getUserOrgByUserId(user_id: number): Promise<OrganizationUserEntity> {
    const knex = this.knex;

    const query = knex
      .select('*')
      .from(this.tableName)
      .where(`user_id`, user_id)
      .where(`is_deleted`, false)
      .first();

    return query;
  }
}
