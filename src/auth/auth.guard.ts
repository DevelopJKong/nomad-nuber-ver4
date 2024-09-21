import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from './../users/users.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/jwt/jwt.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService, private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>('role', context.getHandler());
    if (!roles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    if (!token) {
      return false;
    }

    const decoded = this.jwtService.verify(token.toString());

    if (typeof decoded !== 'object' || !Object.prototype.hasOwnProperty.call(decoded, 'id')) {
      return false;
    }

    const { user } = await this.userService.findById({ userId: decoded['id'] });

    if (!user) {
      return false;
    }

    gqlContext['user'] = user;

    if (roles.includes('Any')) {
      return true;
    }

    return roles.includes(user.role);
  }
}
