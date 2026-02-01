import { SetMetadata } from '@nestjs/common';
import { userRoleEnum } from '../enums/userRole.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: userRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
