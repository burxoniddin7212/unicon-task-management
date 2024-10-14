import { Knex } from 'knex';

export async function createProjectTable(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').createTable('projects ', (table) => {
    table.increments('id').primary();
    table.integer('org_id').references('id').inTable('organizations');
    table.string('name').notNullable();
    table.integer('created_by').references('id').inTable('users');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function revertCreateProjectTable(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('projects');
}
