import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      name: 'ali',
      role: 'admin',
      username: 'username',
      password: '',
      created_by: null,
    },
  ]);
}

///// password=password
