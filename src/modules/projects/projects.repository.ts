import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { UpdateProjectDto } from './dto/update-project.dto';
import { getPagination, QueryPagination } from 'src/common/utilis/pagination';
import { ProjectEntity } from './entities/project.entity';
import { IProjectWithTotal } from './interfaces/project.interface';

@Injectable()
export class ProjectsRepository {
  constructor(@InjectKnex() readonly knex: Knex) {}

  tableName = 'projects';

  async getById(id: number): Promise<ProjectEntity> {
    return await this.knex(this.tableName)
      .select('*')
      .where({ id })
      .where({ is_deleted: false })
      .first();
  }

  async getOrgProjects(
    orgId: number,
    { page, limit }: QueryPagination,
  ): Promise<IProjectWithTotal[]> {
    return await this.knex(this.tableName)
      .select('*')
      .select(this.knex.raw(`count(id) over() as total`))
      .where({ org_id: orgId })
      .where({ is_deleted: false })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(getPagination(page, limit));
  }

  async create(
    createdBy: number,
    orgId: number,
    name: string,
  ): Promise<ProjectEntity[]> {
    return await this.knex(this.tableName)
      .insert({
        name,
        created_by: createdBy,
        org_id: orgId,
      })
      .returning('*');
  }

  async update(body: UpdateProjectDto): Promise<ProjectEntity[]> {
    return await this.knex(this.tableName)
      .where({ id: body.id })
      .update({ name: body.name })
      .returning('*');
  }

  async delete(id: number): Promise<void> {
    await this.knex.transaction(async (trn) => {
      await trn('tasks').where({ project_id: id }).update({ is_deleted: true });

      await trn(this.tableName).where({ id: id }).update({ is_deleted: true });
    });
  }
}
