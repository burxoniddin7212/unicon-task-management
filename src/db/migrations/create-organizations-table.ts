import { Knex } from 'knex';

export async function organizatinsUp(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('public')
    .createTable('organizations ', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('created_by').references('id').inTable('users');
    });
}

export async function organizatinsDown(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('organizations');
}
