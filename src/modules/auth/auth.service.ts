import * as crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto';
import { AuthRepository } from './auth.repository';
import { HTTP_MESSAGES } from 'src/common/constatns/http-messages';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../users/enums/user-role-enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginAuthDto) {
    password = crypto.createHash('sha256').update(password).digest('hex');

    const user = await this.authRepository.getUserByUsernamePasword(
      username,
      password,
    );

    if (!user) throw new UnauthorizedException(HTTP_MESSAGES.USERS_NOT_FOUND);

    delete user.password;

    const orgUser = await this.authRepository.getOrgUserByUserId(user.id);

    const userOrgId: number | null =
      user.role == Role.ADMIN ? null : orgUser.org_id;

    const token = this.jwtService.sign(
      { id: user.id, org_id: userOrgId },
      { secret: process.env.JWT_SECRET, expiresIn: '30d' },
    );

    return { message: HTTP_MESSAGES.OK, data: user, token };
  }
}
