import { Request, Response, NextFunction } from "express"; // Import necessary types from Express
import { NotAuthorizedError } from "../errors/not-authorized-error"; // Import our custom NotAuthorizedError class

// Define a middleware function to ensure the user is authenticated
export const requireAuth = (
  req: Request, // The incoming request
  res: Response, // The outgoing response
  next: NextFunction // The next function in the Express middleware chain
) => {
  if (!req.currentUser) { // If there is no currentUser property on the request (meaning the user is not authenticated)
    throw new NotAuthorizedError(); // Throw a NotAuthorizedError
  }

  next(); // If the user is authenticated, call next() to move to the next middleware function
};