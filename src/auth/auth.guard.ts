import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly relfector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.relfector.get<AllowedRoles>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
