import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { LoginAuthDto } from './dto';

@Injectable()
export class AuthRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getUserByUsernamePasword(username: string, password: string) {
    return await this.knex('users')
      .where('username', username)
      .where('password', password)
      .first();
  }
}
