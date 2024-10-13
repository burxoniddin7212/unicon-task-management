import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class OrganizationUsersRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

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
}
