import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from './statistics.repository';
import { QueryPagination } from 'src/common/utilis/pagination';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { OrganizationEntity } from '../organizations/entities/organization.entity';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly statisticsRepository: StatisticsRepository,
    private readonly orgsService: OrganizationsService,
  ) {}

  async getOrganizationStatistics(query: QueryPagination) {
    const orgsStatistics =
      await this.statisticsRepository.getOrganizationStatistics(query);

    return {
      message: HTTP_MESSAGES.OK,
      data: { data: orgsStatistics, total: orgsStatistics[0]?.total || 0 },
    };
  }

  async getProjectsStatisticsForOneOrg(params: Pick<OrganizationEntity, 'id'>) {
    await this.orgsService.getById(params.id);

    const oneOrgsStatistics =
      await this.statisticsRepository.getProjectsStatisticsForOneOrg(params);

    return { message: HTTP_MESSAGES.OK, data: oneOrgsStatistics };
  }

  async getOrgsProjectsTasksCounts() {
    const [orgsProjectsTasksCount] =
      await this.statisticsRepository.getOrgsProjectsTasksCounts();

    return { message: HTTP_MESSAGES.OK, data: orgsProjectsTasksCount };
  }
}
