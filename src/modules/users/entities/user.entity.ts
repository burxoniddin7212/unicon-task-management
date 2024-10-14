import { Role } from '../enums/user-role-enum';

export interface UserEntity {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: Role;
  created_by: number | null;
  is_deleted: boolean;
  created_at: string;
}
