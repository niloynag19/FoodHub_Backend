
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  if (err.code === 'P2002') {
    statusCode = 400;
    message = "Duplicate value found in database.";
  }
  
  if (err.code === 'P2003') {
    statusCode = 400;
    message = "Invalid reference: The provided ID does not exist in the related table.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err, 
  });
};

export default globalErrorHandler;