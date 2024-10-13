import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { QueryPagination } from 'src/common/utilis/pagination';
import { OrganizationEntity } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async getById(id: number) {
    const organization: OrganizationEntity =
      await this.organizationsRepository.getById(id);

    if (!organization)
      throw new NotFoundException(HTTP_MESSAGES.ORGANIZATIONS_NOT_FOUND);

    return { message: HTTP_MESSAGES.OK, data: organization };
  }

  async getAll(query: QueryPagination) {
    const organization: OrganizationEntity[] =
      await this.organizationsRepository.getAll(query);

    return { message: HTTP_MESSAGES.OK, data: organization };
  }

  async create(createdBy: number, body: CreateOrganizationDto) {
    const [organization]: OrganizationEntity[] =
      await this.organizationsRepository.create(createdBy, body.name);

    return { message: HTTP_MESSAGES.OK, data: organization };
  }

  async update(id: number, { name }: UpdateOrganizationDto) {
    await this.getById(id);

    const [organization]: OrganizationEntity[] =
      await this.organizationsRepository.update(id, name);

    return { message: HTTP_MESSAGES.UPDATED, data: organization };
  }

  async delete(id: number) {
    await this.getById(id);

    await this.organizationsRepository.delete(id);

    return { message: HTTP_MESSAGES.DELETED, data: null };
  }
}
