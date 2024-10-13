export interface OrganizationEntity {
  id: number;
  name: string;
  created_by: number;
  is_deleted?: boolean;
  created_at?: string;
}
