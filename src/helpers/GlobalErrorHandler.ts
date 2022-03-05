/* eslint-disable no-console */
import { Response, Request, NextFunction } from 'express';

import ApiError from '../utils/ApiError';

/**
 * @param err Api Exception hanlder
 * @param req server request object
 * @param res server response object
 * @returns client response
 */
const sendErrorDev = (err: ApiError, req: Request, res: Response) : Response => {
  // A) API routes error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      err,
      message: err.message,
      error: err.error,
      stack: err.stack,
    });
  }

  return res.send({
    status: err.status,
    err,
    message: err.message,
    error: err.error,
    stack: err.stack,
  });
};

/**
 * @param err Api Exception hanlder
 * @param req server request object
 * @param res server response object
 * @returns client response
 */
const sendErrorProd = (err: ApiError, req: Request, res: Response) => {
  // A) API routes
  if (req.originalUrl.startsWith('/api')) {
    // send validation error in production
    if (err.message === 'Request Validation Error') {
      return res.status(err.statusCode).json({
        ...err.error,
      });
    }
    // A) Operational, trusted error: send messagex to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err.error,
      });
    }
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  return res.send('some thing went wrong');
};

const GlobalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);

  if (process.env.NODE_ENV === 'production') {
    const error = { ...err };
    error.message = err.message;

    return sendErrorProd(error, req, res);
  }
};

export default GlobalErrorHandler;
