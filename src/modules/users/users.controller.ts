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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyTokenGuard } from '../shared/guards/verify.token.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { CreateUserForOrganizationDto, UpdateUserDto } from './dto';
import { User } from 'src/common/decorators/user.decorator';
import { QueryPagination } from 'src/common/utilis/pagination';
import { IUserInRequest } from '../shared/types/interface';
import { Role } from './enums/user-role-enum';
import { Roles } from 'src/common/decorators/role.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(VerifyTokenGuard, RoleGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by id' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getByIdWithOrg(+id);
  }

  @Get('org/:orgId/users')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get organization users list' })
  getOrgUsers(@Param('orgId') orgId: string, @Query() query: QueryPagination) {
    return this.usersService.getOrgUsers(+orgId, query);
  }

  @Post('users')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user for organization' })
  createUserForOrganization(
    @User() user: IUserInRequest,
    @Body() body: CreateUserForOrganizationDto,
  ) {
    return this.usersService.createUserForOrganization(user.id, body);
  }

  @Put('users')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user' })
  updateUser(@Body() body: UpdateUserDto) {
    return this.usersService.updateUser(body);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
