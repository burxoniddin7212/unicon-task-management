export interface UserEntity {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: Role;
  created_by: number | null;
}

export enum Role {
  ADMIN = 'ADMIN',
  CHIEF = 'CHIEF',
  STAFF = 'STAFF',
}
