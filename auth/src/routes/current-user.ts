// The GOAL of this route handler:
// To figure out if the user is already logged in by making a request about who the user currently is
// Our code has no direct access or modification of cookies at this step because that is abstracted away
import express from 'express'; // Importing express for routing
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for verifying JWTs

const router = express.Router(); // Creating a new router object

// Define a route to get the current user
router.get('/api/users/currentuser', (req, res) => {
    // If there is no JWT in the session object, return null for currentUser
    if (!req.session?.jwt) { // The '?' is a TypeScript optional chaining operator. It means if req.session is undefined, it will return undefined instead of throwing an error
        return res.send({currentUser: null});
    }

    try {
        // If there is a JWT, verify it
        const payload = jwt.verify(
            req.session.jwt, // The JWT to verify
            process.env.JWT_KEY! // The secret key to use for verification
        );
        // If the JWT is valid, return the payload as the currentUser
        res.send({ currentUser: payload });
    } catch {
        // If the JWT is not valid, return null for currentUser
        res.send({ currentUser: null });
    }
});

export { router as currentUserRouter }; // Export the router for use in other modules
