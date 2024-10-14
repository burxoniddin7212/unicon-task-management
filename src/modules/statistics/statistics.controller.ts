import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyTokenGuard } from '../shared/guards/verify.token.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '../users/enums/user-role-enum';
import { QueryPagination } from 'src/common/utilis/pagination';

@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(VerifyTokenGuard, RoleGuard)
@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('statistics/organizations')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get statistics in cross-section of the organization',
  })
  async getOrganizationStatistics(@Query() query: QueryPagination) {
    return await this.statisticsService.getOrganizationStatistics(query);
  }

  @Get('statistics/organizations/:id/projects')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get statistics of one organization',
  })
  async getProjectsStatisticsForOrg(@Param('id') id: string) {
    return await this.statisticsService.getProjectsStatisticsForOneOrg({
      id: +id,
    });
  }

  @Get('statistics/orgs/projects/tasks/counts')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get organizations, projects, tasks counts',
  })
  async getOrgsProjectsTasksCounts() {
    return await this.statisticsService.getOrgsProjectsTasksCounts();
  }
}
