import { Request } from 'express';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export interface IRequestWithCurrentUser extends Request {
  user?: IUserInRequest;
}

export interface IUserInRequest extends UserEntity {
  org_id: number;
}
