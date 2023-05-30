import express, { Request, Response } from "express"; // Importing necessary types from express
import { body } from "express-validator"; // Importing body from express-validator for validation
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for generating JWTs

import { Password } from "../services/password"; // Importing the Password service for password comparison
import { User } from "../models/user"; // Importing the User model
import { validateRequest } from "../middlewares/validate-request"; // Importing the validateRequest middleware
import { BadRequestError } from "../errors/bad-request-error"; // Importing the BadRequestError class for error handling

const router = express.Router(); // Creating a new router object

router.post(
  "/api/users/signin", // Define the route
  [
    body("email") // Validate the 'email' field
      .isEmail() // Check if the email is valid
      .withMessage("Email must be valid"), // Custom error message if the email is not valid
    body("password") // Validate the 'password' field
      .trim() // Remove leading and trailing whitespace
      .notEmpty() // Check if the password is not empty
      .withMessage("You must supply a password"), // Custom error message if the password is empty
  ],
  validateRequest, // Use the validateRequest middleware to validate the request
  async (req: Request, res: Response) => { // Define the route handler
    const { email, password } = req.body; // Destructure email and password from the request body

    const existingUser = await User.findOne({ email }); // Find a user with the provided email

    if (!existingUser) { // If no user is found
      throw new BadRequestError("Invalid credentials"); // Throw a BadRequestError with a message of "Invalid credentials"
    }

    const passwordsMatch = await Password.compare( // Compare the provided password with the stored password
      existingUser.password,
      password
    );

    if (!passwordsMatch) { // If the passwords do not match
      throw new BadRequestError("Invalid credentials"); // Throw a BadRequestError with a message of "Invalid credentials"
    }

    // Generate a JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id, // Include the user's id in the JWT payload
        email: existingUser.email, // Include the user's email in the JWT payload
      },
      process.env.JWT_KEY! // Sign the JWT with the JWT_KEY environment variable
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt, // Store the JWT on the session object
    };

    res.status(200).send(existingUser); // Send a 200 OK response with the existing user
  }
);

export { router as signinRouter }; // Export the router for use in other modules