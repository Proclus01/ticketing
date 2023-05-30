// The GOAL of this route handler:
// To figure out if the user is already logged in by making a request about who the user currently is
// Our code has no direct access or modification of cookies at this step because that is abstracted away
import express from 'express'; // Importing express for routing

import { currentUser } from '../middlewares/current-user';

const router = express.Router(); // Creating a new router object

// Define a route to get the current user
router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null }); // Send back the currentUser in the response, or null if currentUser is not defined
});

export { router as currentUserRouter }; // Export the router for use in other modules
