import { Knex } from 'knex';

export async function tasksUp(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').createTable('tasks ', (table) => {
    table.increments('id').primary();
    table.integer('created_by').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.integer('project_id').references('id').inTable('projects');
    table.timestamp('due_date');
    table.integer('worker_user_id').references('id').inTable('users');
    table.enum('status', ['CREATED', 'IN_PROCESS', 'DONE']).notNullable();
    table.timestamp('done_at');
  });
}

export async function tasksDown(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').dropTableIfExists('tasks');
}
