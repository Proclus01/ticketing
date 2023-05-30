import express from 'express';  // Importing the express library.
import 'express-async-errors';  // Importing a library to handle async errors.
import { json } from 'body-parser';  // Importing body-parser middleware to handle JSON payloads.
import mongoose from 'mongoose';  // Importing mongoose to connect and interact with MongoDB.
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
        secure: true // Only allow cookie access via HTTPS requests
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

// The start function connects to MongoDB and starts the express application.
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');  // Connecting to MongoDB.
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
    
    app.listen(3000, () => {  // Starting the express application.
        console.log('Listening on port 3000!');
    });
};

start();  // Calling the start function.
