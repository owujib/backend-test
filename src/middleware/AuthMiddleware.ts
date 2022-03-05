import { NextFunction, Request, Response } from 'express';

import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { getManager } from 'typeorm';
import ApiError from '../utils/ApiError';
import { User } from '../entity/User';

class AuthMiddleware {
  public async verifyToken(req: any, res: Response, next: NextFunction) {
    try {
      // 1) Getting token and check of it's there
      let token;
      if (
        req.headers.authorization
        && req.headers.authorization.startsWith('Bearer')
      ) {
        const [, BearerToken] = req.headers.authorization.split(' ');
        token = BearerToken;
      }

      if (!token) {
        return next(
          new ApiError(
            'You are not logged in! Please log in to get access.',
            401,
            {
              user: null,
            },
          ),
        );
      }

      // 2) Verification token
      const jwtSecret: any = process.env.JWT_SECRET;

      const decoded: any = jwt.verify(token, jwtSecret);

      const { id } = decoded;
      // 3) Check if user still exists

      const entityManager = getManager(); // you can also get it via getConnection().manager

      const currentUser = await entityManager.findOne(User, decoded.id);

      if (!currentUser) {
        return next(
          new ApiError(
            'The user belonging to this token does no longer exist.',
            401,
            { user: null },
          ),
        );
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  public restrictTo(role: string) {
    const userRoles = ['test', 'admin', 'user'];
    return (req: any, res: Response, next: NextFunction) => {
      console.log('ROLES', userRoles.indexOf(role), req.user.role);
      if (userRoles.indexOf(role) === req.user.role) {
        return next(
          new ApiError('You do not have permission to perform this action', 403, {
            user: null,
          }),
        );
      }

      return next();
    };
  }
}

export default new AuthMiddleware();
