import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import cloudinary from 'cloudinary';
import { getRepository } from 'typeorm';
import Helpers from '../helpers';
import ApiError from '../utils/ApiError';
import Upload from '../utils/Upload';
import Controller from './Controller';
import { File } from '../entity/File';
import { Folder } from '../entity/Folder';

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

        const s3Data: any = await Helpers.uploadToS3(file);

        const myFile = new File();
        myFile.key = `/files/${s3Data.key}`;
        myFile.bucketId = s3Data.Bucket;
        myFile.user = req.user.id;
        myFile.safe = true;

        await myFile.save();

        return super.sendSuccessResponse(res, myFile, 'File upload successfull', 201);
      } catch (error) {
        return next(error);
      }
    });
  }

  public async createFolder(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.body.folderName) {
        return next(new ApiError('Request Validation Error', 400, { message: 'folderName  can not be empty' }));
      }

      const folder: any = await Helpers.createFolderObject(req.body.folderName);
      console.log(folder);
      const myFolder = new Folder();
      myFolder.name = req.body.folderName;
      myFolder.eTag = folder.ETag;
      myFolder.user = req.user.id;
      await myFolder.save();

      return super.sendSuccessResponse(res, myFolder, 'Folder created', 201);
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

  public async getAllFolders(req:any, res: Response, next: NextFunction) {
    try {
      const folderRepository = getRepository(Folder);
      const folders: any = await folderRepository.find({ where: { user: req.user.id } });
      return super.sendSuccessResponse(res, folders, 'All folders fetched', 200);
    } catch (error) {
      return next(error);
    }
  }

  public downloadFile(req:Request, res: Response, next: NextFunction) {
    try {
      const fileStream = Helpers.getFileStream(req.params.key);
      return fileStream.pipe(res);
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
