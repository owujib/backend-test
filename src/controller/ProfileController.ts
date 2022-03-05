import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import Controller from './Controller';

class ProfileController extends Controller {
  constructor() {
    super();
  }

  public async viewProfile(req: any, res: Response, next: NextFunction) {
    const { user } = req;
    const userRepository = getRepository(User);
    const userProfile: any = await userRepository.findOne(user.id, { relations: ['files', 'folders'] });
    return super.sendSuccessResponse(res, {
      id: userProfile.id,
      fullname: userProfile.fullname,
      email: userProfile.email,
      avatar: userProfile.avatar,
      folders: userProfile.folders,
      files: userProfile.files,
    }, 'User profile details fetched', 200);
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    return super.sendSuccessResponse(res, {}, 'User profile details fetched', 200);
  }

  public async updateProfileImage(req: Request, res: Response, next: NextFunction) {
    return super.sendSuccessResponse(res, {}, 'User profile details fetched', 200);
  }
}

export default new ProfileController();
