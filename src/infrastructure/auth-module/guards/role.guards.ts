import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../role';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this._reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    if (!roles) {
      console.warn(`roles were not set for the route`);
      return false;
    }

    // Assuming user has a `role` property
    const allowed = roles.some((role) => user?.role === role);

    if (!allowed)
      console.warn(
        `access was denied since ${user.roles} role/s does not match with access roles ${roles}.`,
      );
    return allowed;
  }
}
