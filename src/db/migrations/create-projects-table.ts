import { Knex } from 'knex';

export async function projectsUp(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').createTable('projects ', (table) => {
    table.increments('id').primary();
    table.integer('org_id').references('id').inTable('organizations');
    table.integer('created_by').references('id').inTable('users');
  });
}

export async function projectsDown(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('projects');
}
