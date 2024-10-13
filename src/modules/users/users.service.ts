import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserForOrganizationDto, UpdateUserDto } from './dto';
import { UserEntity } from '../auth/entities/users.entity';
import { OrganizationUsersRepository } from './organization-users.repository';
import { OrganizationsService } from '../organizations/organizations.service';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { QueryPagination } from 'src/common/utilis/pagination';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly orgUsersRepository: OrganizationUsersRepository,
    private readonly orgService: OrganizationsService,
  ) {}

  async getByIdWithOrg(id: number) {
    const user = await this.usersRepository.getByIdWithOrg(id);

    if (!user) throw new NotFoundException(HTTP_MESSAGES.USERS_NOT_FOUND);

    return { message: HTTP_MESSAGES.OK, data: user };
  }

  async getOrgUsers(orgId: number, query: QueryPagination) {
    const orgUsers = await this.usersRepository.getOrgUsers(orgId, query);

    return { message: HTTP_MESSAGES.OK, data: orgUsers };
  }

  async createUserForOrganization(
    created_by: number,
    body: CreateUserForOrganizationDto,
  ) {
    await this.orgService.getById(body.org_id);

    const checkByUsername = await this.usersRepository.getByUsername(
      body.username,
    );

    if (checkByUsername)
      throw new BadRequestException(HTTP_MESSAGES.USERS_USERNAME_UNIQUE);

    body.password = crypto
      .createHash('sha256')
      .update(body.password)
      .digest('hex');

    const [userOrg] = await this.usersRepository.knex.transaction(
      async (trn) => {
        const [user]: UserEntity[] = await this.usersRepository.createUser(
          trn,
          {
            created_by,
            name: body.name,
            role: body.role,
            username: body.username,
            password: body.password,
          },
        );

        return await this.orgUsersRepository.createOrgUser({
          trn,
          user_id: user.id,
          org_id: body.org_id,
        });
      },
    );

    return { message: HTTP_MESSAGES.OK, data: userOrg };
  }

  async updateUser(body: UpdateUserDto) {
    await this.getById(body.user_id);

    const user = await this.usersRepository.updateUser(body);

    return { message: HTTP_MESSAGES.UPDATED, data: user };
  }

  async deleteUser(id: number) {
    await this.getById(id);

    await this.usersRepository.deleteUser(id);

    return { message: HTTP_MESSAGES.DELETED, data: null };
  }

  async getById(id: number) {
    const user = await this.usersRepository.getById(id);

    if (!user) throw new NotFoundException(HTTP_MESSAGES.USERS_NOT_FOUND);

    return { message: HTTP_MESSAGES.OK, data: user };
  }
}
