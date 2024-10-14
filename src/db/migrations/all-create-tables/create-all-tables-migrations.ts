import { Knex } from 'knex';
import { revertCreateUserTable, createUserTable } from '../create-users-table';
import { reverCreateTaskTable, createTaskTable } from '../create-tasks-table';
import {
  revertCreateProjectTable,
  createProjectTable,
} from '../create-projects-table';
import {
  createOrganizatinTable,
  revertCreateOrganizatinTable,
} from '../create-organizations-table';
import {
  createOrganizatinUserTable,
  revertCreateOrganizatinUserTable,
} from '../create-organization-user-table';

export async function up(knex: Knex): Promise<void> {
  await createUserTable(knex);
  await createOrganizatinTable(knex);
  await createOrganizatinUserTable(knex);
  await createProjectTable(knex);
  await createTaskTable(knex);
}

export async function down(knex: Knex): Promise<void> {
  await revertCreateUserTable(knex);
  await revertCreateOrganizatinTable(knex);
  await revertCreateOrganizatinUserTable(knex);
  await revertCreateProjectTable(knex);
  await reverCreateTaskTable(knex);
}
