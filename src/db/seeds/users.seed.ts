import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      name: 'ali',
      role: 'ADMIN',
      username: 'username',
      password:
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      created_by: null,
    },
  ]);
}

///// password=password
