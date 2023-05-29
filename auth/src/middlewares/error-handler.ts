import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

// errorHandler is a middleware function for handling errors in Express.
export const errorHandler = (
  err: Error,  // The error that was thrown.
  req: Request,  // The Express Request object.
  res: Response,  // The Express Response object.
  next: NextFunction  // A function to pass control to the next middleware.
) => {
  // If the error that was thrown is an instance of CustomError, 
  // it means it's an error we've specifically thrown ourselves in the code.
  if (err instanceof CustomError) {
    // Respond with the status code from the custom error and serialize the error for the client.
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // If the error is not an instance of CustomError, it's an unexpected error.
  // We return a generic 400 status code and a generic error message.
  res.status(400).send({
    errors: [{ messsage: 'Something went wrong'}]
  });
};
