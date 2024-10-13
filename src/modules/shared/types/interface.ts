import { Request } from 'express';
import { UserEntity } from 'src/modules/auth/entities/users.entity';

export interface IRequestWithCurrentUser extends Request {
  user?: UserEntity;
}
