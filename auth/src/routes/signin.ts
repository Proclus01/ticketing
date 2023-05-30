import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middlewares/validate-request';

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
    validateRequest,
    (req: Request, res: Response) => {

});

export { router as signinRouter }; // Export the router for use in other modules