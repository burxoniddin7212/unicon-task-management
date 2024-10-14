import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryPagination } from 'src/common/utilis/pagination';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly orgService: OrganizationsService,
  ) {}

  async getById(id: number) {
    const project = await this.projectsRepository.getById(id);

    if (!project)
      throw new BadRequestException(HTTP_MESSAGES.PROJECTS_NOT_FOUND);

    return { message: HTTP_MESSAGES.OK, data: project };
  }

  async getOrgProjects(orgId: number, query: QueryPagination) {
    await this.orgService.getById(orgId);

    const projects = await this.projectsRepository.getOrgProjects(orgId, query);

    return {
      message: HTTP_MESSAGES.OK,
      data: { data: projects, total: projects[0]?.total || 0 },
    };
  }

  async create(createdBy: number, orgId: number, { name }: CreateProjectDto) {
    await this.orgService.getById(orgId);

    const [project] = await this.projectsRepository.create(
      createdBy,
      orgId,
      name,
    );

    return { message: HTTP_MESSAGES.OK, data: project };
  }

  async update(body: UpdateProjectDto) {
    await this.getById(body.id);

    const [project] = await this.projectsRepository.update(body);

    return { message: HTTP_MESSAGES.UPDATED, data: project };
  }

  async delete(id: number) {
    await this.getById(id);

    await this.projectsRepository.delete(id);

    return { message: HTTP_MESSAGES.DELETED, data: null };
  }
}
