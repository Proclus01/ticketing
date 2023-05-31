import mongoose from 'mongoose';  // Importing mongoose to connect and interact with MongoDB.
import { app } from './app';

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
