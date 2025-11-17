import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // <-- req.user comes from JwtStrategy
    console.log('user from RolesGuard:', request.user);
    console.log('headers', request.headers)

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('User does not have permission.');
    }

    return true;
  }
}
