/* eslint-disable max-len */
import 'dotenv/config';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { User } from '../entity/User';
import ApiError from '../utils/ApiError';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class Helpers {
  public static signToken(payload: object) {
    const secret: any = process.env.JWT_SECRET;
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  public static createResponseToken(user: User, statusCode: number, res: Response): Response {
    const token = Helpers.signToken({ id: user.id });

    return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  }

  public static cloudinaryImageUploadMethod = async (file: string) => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      (error, result) => {
        if (error) {
          return reject(new ApiError('upload image error', 500, {
            file: error,
          }));
        }

        return resolve({
          file: result,
        });
      },

    );
  });

  public static cloudinaryFolderMethod = async (file: string, publicId: string) => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(new ApiError('upload image error', 500, {
          file: error,
        }));
      }
      return resolve(result);
    });
  });
}
