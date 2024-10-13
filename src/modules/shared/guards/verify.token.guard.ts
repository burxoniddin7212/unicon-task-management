import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { JwtService } from '@nestjs/jwt';
import { IRequestWithCurrentUser } from '../types/interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context
      .switchToHttp()
      .getRequest<IRequestWithCurrentUser>();

    let token = request.headers.authorization;

    if (!token) return false;

    token = token.replace('Bearer ', '');

    const verifyToken: { id: number; org_id: number | null } =
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

    const user: UserEntity = await this.knex('users')
      .where('id', verifyToken.id)
      .first();

    if (!user) return false;

    delete user.password;

    request.user = { ...user, org_id: verifyToken.org_id };

    return true;
  }
}
