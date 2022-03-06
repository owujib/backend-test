/* eslint-disable max-len */
import 'dotenv/config';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';
import { string } from 'joi';
import { User } from '../entity/User';
import ApiError from '../utils/ApiError';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

interface UPLOADPARAMS {
  Bucket: string
  Body: fs.ReadStream
  Key: string
 }
interface DOWNLOADPARAMS {
  Key: string
  Bucket: string
 }

export default class Helpers {
  public static uploadToS3(file: any) {
    const fileStream: fs.ReadStream = fs.createReadStream(file.path);
    const uploadParams:UPLOADPARAMS = {
      Bucket: <string>process.env.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
  }

  public static getFileStream(key: string) {
    const downloadParams: DOWNLOADPARAMS = {
      Key: key,
      Bucket: <string>process.env.AWS_BUCKET_NAME,
    };

    return s3.getObject(downloadParams).createReadStream();
  }

  public static createFolderObject(folderName: string) {
    return s3.putObject({
      Key: `${folderName}/`,
      Bucket: <string>process.env.AWS_BUCKET_NAME,
    }).promise();
  }

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
