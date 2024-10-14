import { OrganizationEntity } from '../entities/organization.entity';

export interface IOrganizationWithTotal extends OrganizationEntity {
  total?: string;
}
