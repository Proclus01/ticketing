import express from 'express';  // Importing the express library.
import 'express-async-errors';  // Importing a library to handle async errors.
import { json } from 'body-parser';  // Importing body-parser middleware to handle JSON payloads.

import cookieSession from 'cookie-session';

// Importing route handlers.
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';  // Importing our custom error handling middleware.
import { NotFoundError } from './errors/not-found-error';  // Importing our custom NotFound error class.

const app = express();  // Creating an express application.
app.set('trust proxy', true); // Express is going to trust traffic proxied through our Ingress-Nginx
app.use(json());  // Using body-parser middleware to parse JSON payloads.
app.use(
    cookieSession({
        signed: false, // Disable cookie encryption
        secure: process.env.NODE_ENV !== 'test' // Only allow cookie access via HTTPS requests
    })
);

// Attaching the route handlers to the express application.
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Any request that isn't caught by the above routes will be handled here,
// and will throw a NotFoundError.
app.all('*', async (req, res) => {
    throw new NotFoundError()
});

app.use(errorHandler);  // Attaching our custom error handler to the express application.

export { app };