// Import the scrypt and randomBytes functions from the crypto module
import { scrypt, randomBytes } from 'crypto';
// Import the promisify function from the util module
import { promisify } from 'util';

// Use promisify to create an async version of scrypt
const scryptAsync = promisify(scrypt);

// Define a Password class
export class Password {
    // Method to hash a password
    // The 'static' access modifier means you can call this method without creating a new class instance
    static async toHash(password: string) {
        // Generate a random salt
        const salt = randomBytes(8).toString('hex');
        // Hash the password with the salt
        const buf = (await scryptAsync(password, salt, 64) as Buffer);

        // Return the hashed password and salt
        return `${buf.toString('hex')}.${salt}`;
    }

    // Method to compare a stored password with a supplied password
    static async compare(storedPassword: string, suppliedPassword: string) {
        // Split the stored password into the hashed password and salt
        const [hashedPassword, salt] = storedPassword.split('.');
        // Hash the supplied password with the salt
        const buf = (await scryptAsync(suppliedPassword, salt, 64) as Buffer);

        // Compare the hashed supplied password with the stored hashed password
        return buf.toString('hex') === hashedPassword;
    }
}
