import { OrganizationEntity } from 'src/modules/organizations/entities/organization.entity';
import { Role } from '../enums/user-role-enum';

export interface IUserInfoWithOrg {
  user_id: number;
  org_id: number;
  name: string;
  username: string;
  role: Role;
  org_name: string;
}

export interface IGetOrgUsers {
  id: number;
  name: string;
  username: string;
  role: 'ADMIN' | 'CHIEF' | 'STAFF';
  organization: Pick<OrganizationEntity, 'id' | 'name'>;
  total?: string;
}
