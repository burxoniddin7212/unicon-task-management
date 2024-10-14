import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/users/enums/user-role-enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Role[]>(
      'ROLES_KEY',
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions?.length === 0 || !requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const userPermissions = request?.user?.role || '';

    if (!requiredPermissions.includes(userPermissions)) return false;

    return true;
  }
}
