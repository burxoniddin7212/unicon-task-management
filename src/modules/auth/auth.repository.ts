import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class AuthRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getUserByUsernamePasword(username: string, password: string) {
    return await this.knex('users')
      .where('username', username)
      .where('password', password)
      .first();
  }

  async getOrgUserByUserId(id: number) {
    return await this.knex('organization_users').where('user_id', id).first();
  }
}
