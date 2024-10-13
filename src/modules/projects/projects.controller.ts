import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyTokenGuard } from '../shared/guards/verify.token.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { setMetadataKey } from 'src/common/constatns/consts';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryPagination } from 'src/common/utilis/pagination';
import { IUserInRequest } from '../shared/types/interface';
import { Role } from '../users/entities/user.entity';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(VerifyTokenGuard, RoleGuard)
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects/:id')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get project by id' })
  getById(@Param('id') id: string) {
    return this.projectsService.getById(+id);
  }

  @Get('projects')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all projects for organizations' })
  getOrgProjects(
    @User() user: IUserInRequest,
    @Query() query: QueryPagination,
  ) {
    return this.projectsService.getOrgProjects(user.org_id, query);
  }

  @Post('projects')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create project' })
  create(@User() user: IUserInRequest, @Body() body: CreateProjectDto) {
    return this.projectsService.create(user.id, user.org_id, body);
  }

  @Put('projects')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project' })
  update(@Body() body: UpdateProjectDto) {
    return this.projectsService.update(body);
  }

  @Delete('projects/:id')
  @SetMetadata(setMetadataKey, [Role.CHIEF])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project' })
  delete(@Param('id') id: string) {
    return this.projectsService.delete(+id);
  }
}
