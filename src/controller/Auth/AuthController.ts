import { Request, Response, NextFunction } from 'express';
import { getCustomRepository, getManager, getRepository } from 'typeorm';
import { User } from '../../entity/User';
import { LoginValidation, RegistrationValidation } from '../../validation/AuthValidation';
import Controller from '../Controller';
import ApiError from '../../utils/ApiError';
import { UserRepository } from '../../repository/UserRepository';
import Helpers from '../../helpers';

class AuthController extends Controller {
  constructor() {
    super();
  }

  /**
   * @param req sever request object
   * @param res sever response object
   * @param next server next function request handler
   * @method `POST`
   */
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const { error } = RegistrationValidation(body);

      if (error) {
        return next(new ApiError('Request Validation Error', 400, {
          message: error.message,
        }));
      }

      /** check if user exists */
      const userExist = await User.findOne({ email: body.email });

      if (userExist) {
        return next(new ApiError('Email has already been taken', 400, {
          user: null,
        }));
      }

      const user = new User();
      user.email = body.email;
      user.fullname = body.fullname;
      user.password = body.password;
      user.role = 2; // 1 an admin represents,  admin 2 represents a user

      await user.save();

      return super.sendSuccessResponse(res, {
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        avatar: user.avatar,
      }, 'User Registration Successfull', 201);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @param req sever request object
   * @param res sever response object
   * @param next server next function request handler
   * @method `POST`
   */
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const { error } = LoginValidation(body);

      if (error) {
        return next(new ApiError('Request Validation Error', 400, {
          message: error.message,
        }));
      }

      const userRepository = getCustomRepository(UserRepository);

      /** check if user exists */
      const user = await User.findOne({ email: body.email });

      if (!user) {
        return next(new ApiError('User does not exist', 400, {
          user: null,
        }));
      }

      /** check if password is correct */
      const comparePassword = await userRepository.comparePassword(body.password, user.password);
      if (!comparePassword) {
        return next(new ApiError('Invalid credentials try again', 400, {
          user: null,
        }));
      }

      return Helpers.createResponseToken(user, 200, res);
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
