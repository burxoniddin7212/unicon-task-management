import { Knex } from 'knex';

export async function createUserTable(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.enum('role', ['ADMIN', 'CHIEF', 'STAFF']).notNullable();
    table.integer('created_by').references('id').inTable('users');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function revertCreateUserTable(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('users');
}
