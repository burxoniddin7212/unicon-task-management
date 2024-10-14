import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { UserEntity } from '../users/entities/user.entity';
import { OrganizationUserEntity } from '../users/entities/organization-user.entity';

@Injectable()
export class AuthRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getUserByUsernamePasword(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    return await this.knex('users')
      .where('username', username)
      .where('password', password)
      .first();
  }

  async getOrgUserByUserId(id: number): Promise<OrganizationUserEntity> {
    return await this.knex('organization_users').where('user_id', id).first();
  }
}
