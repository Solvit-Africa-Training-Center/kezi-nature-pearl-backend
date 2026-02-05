import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../logger/logger.service';

import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '../enums/user.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly logger: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    const hasAccess = requiredRoles.includes(user.role);

    if (!hasAccess) {
      this.logger.warn(
        {
          event: 'ACCESS_DENIED',
          userId: user?.id,
          route: request.originalUrl,
          requiredRoles,
          requiredRole: user?.role,
        },
        'User attempted forbidden action',
      );
    }

    return hasAccess;
  }
}
