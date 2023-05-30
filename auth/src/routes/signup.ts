import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

// Create a new router object
const router = express.Router();

// Define a POST route for user signup
router.post(
  "/api/users/signup",
  [
    // Validate the email field
    body("email").isEmail().withMessage("Email must be valid"),
    // Validate the password field
    body("password")
      .trim() // Remove leading and trailing whitespace
      .isLength({ min: 4, max: 20 }) // Check the length of the password
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);

    // If there are validation errors, throw a RequestValidationError
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    // If a user with the provided email already exists, throw a BadRequestError
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    // Create a new user
    const user = User.build({ email, password });
    // Save the new user to the database
    await user.save();

    // Generate a JWT
    const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, 
        process.env.JWT_KEY! // exclamation tells TypeScript that we already know this env variable is defined
    );

    // Store it on the session object
    req.session = {
        jwt: userJwt // Redefine the entire object jwt and set it to userJwt instead of req.session.jwt
    }

    // Send a 201 Created status code along with the new user
    res.status(201).send(user);
  }
);

// Export the router
export { router as signupRouter };
