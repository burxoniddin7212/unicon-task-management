import { Knex } from 'knex';

export async function createOrganizatinTable(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('public')
    .createTable('organizations ', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('created_by').references('id').inTable('users');
      table.boolean('is_deleted').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function revertCreateOrganizatinTable(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('organizations');
}
