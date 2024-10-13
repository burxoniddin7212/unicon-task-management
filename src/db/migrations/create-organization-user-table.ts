import { Knex } from 'knex';

export async function organizatinUsersUp(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('public')
    .createTable('organization_users ', (table) => {
      table.increments('id').primary();
      table.integer('org_id').references('id').inTable('organizations');
      table.integer('user_id').references('id').inTable('users');
      table.boolean('is_deleted').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function organizatinUsersDown(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('public')
    .dropTableIfExists('organization_users');
}
