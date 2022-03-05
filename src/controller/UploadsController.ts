import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import cloudinary from 'cloudinary';
import AWS from 'aws-sdk';
import { getRepository } from 'typeorm';
import Helpers from '../helpers';
import ApiError from '../utils/ApiError';
import Upload from '../utils/Upload';
import Controller from './Controller';
import { File } from '../entity/File';

const s3: any = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env
});
// s3.pu

class UploadsController extends Controller {
  constructor() {
    super();
  }

  public async uploadFile(req: any, res: Response, next: NextFunction) {
    const upload = Upload.single('file');
    upload(req, res, async (err: any) => {
      try {
        const { file, body } = req;

        if (!file) {
          return next(new ApiError('No file Uploaded', 400, {
            file: null,
          }));
        }
        const newFile: any = await Helpers.cloudinaryImageUploadMethod(file.path);

        const myFile = new File();
        myFile.fileUrl = newFile.file.secure_url;
        myFile.publicId = newFile.file.public_id;
        myFile.user = req.user.id;
        myFile.safe = true;

        await myFile.save();

        return super.sendSuccessResponse(res, myFile, 'File upload successfull', 201);
      } catch (error) {
        return next(error);
      }
    });
  }

  public async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      // const folder: any = await Helpers.cloudinaryFolderMethod('favour');
      return super.sendSuccessResponse(res, {}, 'Folder created', 201);
    } catch (error) {
      return next(error);
    }
  }

  //   public async deletFile(req: Request, res: Response, next: NextFunction) : Response {}

  public async getFileHistory(req: any, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const fileRepository = getRepository(File);
      const files: any = await fileRepository.find({ where: { user: user.id } });
      return super.sendSuccessResponse(res, files, `File history fetched for ${user.email}`, 200);
    } catch (error) {
      return next(error);
    }
  }

  public async getAllFiles(req:any, res: Response, next: NextFunction) {
    try {
      const fileRepository = getRepository(File);
      const files: any = await fileRepository.find();
      return super.sendSuccessResponse(res, files, 'All Files fetched', 200);
    } catch (error) {
      return next(error);
    }
  }

  public async downloadFile(req:Request, res: Response, next: NextFunction) {
    try {
      const fileRepository = getRepository(File);
      const files: any = await fileRepository.findOne(req.params.id);
      const download = fs.createReadStream(files.fileUrl);

      // return download.pipe(res);
    } catch (error) {
      return next(error);
    }
  }

  public async unsafeFile(req:Request, res: Response, next: NextFunction) {
    try {
      const fileRepository = getRepository(File);
      const files: any = await fileRepository.findOne(req.params.id);
      const data = await Helpers.cloudinaryFolderMethod(files.fileUrl, files.publicId);
      await fileRepository.delete(files.id);
      return super.sendSuccessResponse(res, { file: null }, 'file deleted', 200);
    } catch (error) {
      return next(error);
    }
  }
}

export default new UploadsController();
