import {
  Router, Request, Response, NextFunction,
} from 'express';
import AuthController from '../controller/Auth/AuthController';
import ProfileController from '../controller/ProfileController';
import UploadsController from '../controller/UploadsController';
import AuthMiddleware from '../middleware/AuthMiddleware';

import ApiError from '../utils/ApiError';

const Route = Router();

/** @route welcome route */
Route.get('/', (req: Request, res: Response) => res.status(200).json({
  message: 'Welcome to my world. Hello World',
}));

/** @routes authentication routes */
Route.post('/register', AuthController.register);
Route.post('/login', AuthController.login);

/** @routes user routes */
Route.get('/profile', AuthMiddleware.verifyToken, ProfileController.viewProfile);

/** @routes media routes */
Route.post('/upload-file', AuthMiddleware.verifyToken, UploadsController.uploadFile);
Route.get('/get-file-history', AuthMiddleware.verifyToken, UploadsController.getFileHistory);
Route.get('/get-all-files', AuthMiddleware.verifyToken, AuthMiddleware.restrictTo('user'), UploadsController.getAllFiles);
Route.get('/get-folder-history', AuthMiddleware.verifyToken, UploadsController.getAllFolders);
// Route.post('/upload-file/:folderId', AuthMiddleware.verifyToken, UploadsController.createFolder);
Route.delete('/unsafe-file/:key', AuthMiddleware.verifyToken, AuthMiddleware.restrictTo('user'), UploadsController.unsafeFile);
Route.post('/create-folder', AuthMiddleware.verifyToken, UploadsController.createFolder);
Route.get('/files/:key', UploadsController.downloadFile);

Route.all('*', (req: Request, res: Response, next: NextFunction) => next(new ApiError('the route your are looking for has been moved or does not exist', 404, {})));

export default Route;
