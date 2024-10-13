import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { OrganizationsService } from './organizations.service';
import {
  Put,
  Body,
  Post,
  Param,
  Delete,
  HttpCode,
  Controller,
  UseGuards,
  HttpStatus,
  SetMetadata,
  Get,
  Query,
} from '@nestjs/common';
import { RoleGuard } from '../shared/guards/role.guard';
import { VerifyTokenGuard } from '../shared/guards/verify.token.guard';
import { setMetadataKey } from 'src/common/constatns/consts';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { QueryPagination } from 'src/common/utilis/pagination';
import { IUserInRequest } from '../shared/types/interface';
import { Role } from '../users/entities/user.entity';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(VerifyTokenGuard, RoleGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('organizations/:id')
  @SetMetadata(setMetadataKey, [Role.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get organization by id' })
  getById(@Param('id') id: string) {
    return this.organizationsService.getById(+id);
  }

  @Get('organizations')
  @SetMetadata(setMetadataKey, [Role.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all organizations' })
  getAll(@Query() query: QueryPagination) {
    return this.organizationsService.getAll(query);
  }

  @Post('organizations')
  @SetMetadata(setMetadataKey, [Role.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create organization' })
  create(@User() user: IUserInRequest, @Body() body: CreateOrganizationDto) {
    return this.organizationsService.create(user.id, body);
  }

  @Put('organizations/:id')
  @SetMetadata(setMetadataKey, [Role.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update organization' })
  update(@Body() body: UpdateOrganizationDto, @Param('id') id: string) {
    return this.organizationsService.update(+id, body);
  }

  @Delete('organizations/:id')
  @SetMetadata(setMetadataKey, [Role.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete organization' })
  delete(@Param('id') id: string) {
    return this.organizationsService.delete(+id);
  }
}
