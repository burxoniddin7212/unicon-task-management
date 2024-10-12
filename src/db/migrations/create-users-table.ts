import { Knex } from 'knex';

export async function usersUp(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.enum('role', ['ADMIN', 'CHIEF', 'STAFF']).notNullable();
    table.integer('created_by').references('id').inTable('users');
  });
}

export async function usersDown(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('users');
}
