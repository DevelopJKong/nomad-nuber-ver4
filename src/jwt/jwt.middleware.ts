import { UsersService } from './../users/users.service';
import { Injectable, NestMiddleware, InternalServerErrorException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && Object.prototype.hasOwnProperty.call(decoded, 'id')) {
        try {
          const { user } = await this.usersService.findById(decoded['id']);
          req['user'] = user;
        } catch (error) {
          next(new InternalServerErrorException());
        }
      }
    }
    next();
  }
}
