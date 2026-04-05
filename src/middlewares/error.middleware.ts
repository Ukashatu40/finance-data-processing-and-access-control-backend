import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors: err.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle Known Operational Errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};
