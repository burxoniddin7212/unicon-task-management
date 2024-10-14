import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';
import {
  IGetAllCount,
  IOrgsStatistics,
  IProjectStatistics,
} from './interfaces/statistica.interface';
import { OrganizationEntity } from '../organizations/entities/organization.entity';

@Injectable()
export class StatisticsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getOrganizationStatistics({
    limit,
    page,
  }: QueryPagination): Promise<IOrgsStatistics[]> {
    const knex = this.knex;

    return await this.knex('organizations as o')
      .leftJoin('projects as p', function () {
        this.on('o.id', 'p.org_id').andOn(
          'p.is_deleted',
          knex.raw('?', [false]),
        );
      })
      .leftJoin('tasks as t', function () {
        this.on('p.id', 't.project_id').andOn(
          't.is_deleted',
          knex.raw('?', [false]),
        );
      })
      .where({ 'o.is_deleted': false })
      .groupBy('o.id')
      .orderBy('o.created_at', 'desc')
      .select(
        'o.id as organization_id',
        'o.name as organization_name',
        knex.raw('COUNT(DISTINCT p.id) as project_count'),
        knex.raw('COUNT(t.id) as task_count'),
      )
      .select(knex.raw(`count(o.id) over() as total`))
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async getProjectsStatisticsForOneOrg(
    params: Pick<OrganizationEntity, 'id'>,
  ): Promise<IProjectStatistics> {
    const knex = this.knex;

    return await knex('organizations as o')
      .leftJoin('projects as p', function () {
        this.on('o.id', 'p.org_id').andOn(
          'p.is_deleted',
          knex.raw('?', [false]),
        );
      })
      .where('o.id', params.id)
      .select(
        'o.id as organization_id',
        'o.name as organization_name',
        this.knex.raw(`
        JSON_AGG (
          JSON_BUILD_OBJECT(
            'project_id', p.id,
            'project_name', p.name,
            'task_count', (
              SELECT COUNT(*)
              FROM tasks as t
              WHERE t.project_id = p.id AND t.is_deleted = false
            )
          ) ORDER BY p.created_at DESC
        ) FILTER (WHERE p.id IS NOT NULL) as projects
      `),
      )
      .groupBy('o.id')
      .first();
  }

  async getOrgsProjectsTasksCounts(): Promise<IGetAllCount[]> {
    return await this.knex
      .select({
        organizations_count: this.knex.raw('COUNT(*)'),
        projects_count: this.knex.raw(
          '(SELECT COUNT(*) FROM projects WHERE is_deleted = false)',
        ),
        tasks_count: this.knex.raw(
          '(SELECT COUNT(*) FROM tasks WHERE is_deleted = false)',
        ),
      })
      .from('organizations')
      .where('is_deleted', false);
  }
}
