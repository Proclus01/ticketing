import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email') // Validate the 'email' field
            .isEmail() // Check if the email is valid
            .withMessage('Email must be valid'), // Custom error message if the email is not valid
        body('password') // Validate the 'password' field
            .trim() // Remove leading and trailing whitespace
            .notEmpty() // Check if the password is not empty
            .withMessage('You must supply a password') // Custom error message if the password is empty
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req); // Collect validation errors

        if (!errors.isEmpty()) {   // If there are validation errors
            throw new RequestValidationError(errors.array()); // Throw a RequestValidationError with the array of errors
        }

});

export { router as signinRouter }; // Export the router for use in other modules