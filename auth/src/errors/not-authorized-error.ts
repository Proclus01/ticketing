import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401; // Set the HTTP status code for this error type

    constructor() {
        super('Not authorized'); // Call the parent class constructor with the error message
        Object.setPrototypeOf(this, NotAuthorizedError.prototype); // Set the prototype explicitly to handle TypeScript's class inheritance
    }

    serializeErrors() { // Define a method to serialize the errors for sending in a response
        return [{ message: 'Not authorized'}]; // Return an array of error messages
    }
}
