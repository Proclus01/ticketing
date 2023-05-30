// A Signout route will send a header that tells the browser
// to dump all the information stored in the cookie and JWT
import express from 'express'; // Importing express for routing

const router = express.Router(); // Creating a new router object

// Define a route to sign out the user
router.post('/api/users/signout', (req, res) => {
    req.session = null; // Clear the session object, which will also clear the JWT stored in the session

    res.send({}); // Send an empty response
});

export { router as signoutRouter }; // Export the router for use in other modules