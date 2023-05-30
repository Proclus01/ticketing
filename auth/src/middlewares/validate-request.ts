import { Request, Response, NextFunction } from "express"; // Importing necessary types from express
import { validationResult } from "express-validator"; // Importing validationResult from express-validator for validation
import { RequestValidationError } from "../errors/request-validation-error"; // Importing custom error class

// Define a middleware function to validate the request
export const validateRequest = (
  req: Request, // The incoming request
  res: Response, // The outgoing response
  next: NextFunction // The next middleware function in the chain
) => {
    const errors = validationResult(req); // Collect validation errors from the request

    if (!errors.isEmpty()) { // If there are validation errors
        throw new RequestValidationError(errors.array()); // Throw a RequestValidationError with the array of errors
    }

    next(); // If there are no validation errors, call the next middleware function
};