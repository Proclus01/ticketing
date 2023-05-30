import { Request, Response, NextFunction } from "express"; // Importing types from express
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for handling JWTs

// Define an interface for the user payload in the JWT
interface UserPayload {
    id: string;
    email: string;
}

// Extend the Express Request type to include a currentUser property
declare global { 
    namespace Express {
        interface Request {
            currentUser?: UserPayload; // Add a currentUser property to the Request type
        }
    }
}

// Define a middleware function to attach the currentUser to the request
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if (!req.session?.jwt) { // If there is no JWT in the session
        return next(); // Continue to the next middleware
    }

    try {
        // Verify the JWT and cast the result to the UserPayload type
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload; 
        req.currentUser = payload; // Attach the payload to the request as currentUser
    } catch (err) {
        // If there is an error verifying the JWT, ignore it and continue to the next middleware
    }

    next(); // Continue to the next middleware
};