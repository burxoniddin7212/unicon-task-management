import { Knex } from 'knex';
import { usersDown, usersUp } from '../create-users-table';
import { tasksDown, tasksUp } from '../create-tasks-table';
import { projectsDown, projectsUp } from '../create-projects-table';
import {
  organizatinsUp,
  organizatinsDown,
} from '../create-organizations-table';
import {
  organizatinUsersUp,
  organizatinUsersDown,
} from '../create-organization-user-table';

export async function up(knex: Knex): Promise<void> {
  await usersUp(knex);
  await organizatinsUp(knex);
  await organizatinUsersUp(knex);
  await projectsUp(knex);
  await tasksUp(knex);
}

export async function down(knex: Knex): Promise<void> {
  await usersDown(knex);
  await organizatinsDown(knex);
  await organizatinUsersDown(knex);
  await projectsDown(knex);
  await tasksDown(knex);
}
