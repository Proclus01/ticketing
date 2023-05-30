import mongoose from "mongoose";  // Importing mongoose to interact with MongoDB.
import { Password } from '../services/password'; // Import the Password class for hashing / comparing passwords

// UserAttrs interface: This defines the properties required to create a new User.
interface UserAttrs {
    email: string;  // The user's email. It must be a string.
    password: string;  // The user's password. It must be a string.
}

// UserModel interface: This describes the properties that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;  // A method to build a new User document with specified attributes.
}

// UserDoc interface: This describes the properties that a User Document has.
interface UserDoc extends mongoose.Document {
    email: string;  // The email property of a User document. It is a string.
    password: string;  // The password property of a User document. It is a string.
}

// Creating a Mongoose schema for a User. 
const userSchema = new mongoose.Schema({
    email: {
        type: String,  // The email field should be a string.
        required: true  // The email field is required.
    },
    password: {
        type: String,  // The password field should be a string.
        required: true  // The password field is required.
    }
}, {
    // The toJSON property is a special property in Mongoose schemas that allows you to customize how the results of a query are converted into JSON.
    toJSON: {
        // The transform function is a method that Mongoose calls when you convert a MongoDB document into a JSON representation.
        // It gets passed the mongoose document and the plain JavaScript object that results from calling .toObject() on the mongoose document.
        // The 'doc' parameter is the mongoose document being converted.
        // The 'ret' (short for resultant object) parameter is the plain object representation which will be turned into JSON.
        transform(doc, ret) {
            ret.id = ret._id; // Set _id to become id and normalize the JSON
            delete ret._id; // delete the old _id field so it is not returned
            delete ret.password; // delete the password field so that is not returned
            delete ret.__v; // delete the version field so that is not returned
        }
    }
});

// This is a Mongoose middleware function that gets executed before a document is saved to the database.
userSchema.pre('save', async function(done) {
    // 'this' refers to the document that is about to be saved.
    // 'isModified' is a Mongoose method that checks if a certain field has been modified.
    // In this case, it checks if the 'password' field has been modified.
    if (this.isModified('password')) {
        // If the password has been modified, it needs to be hashed before saving.
        // 'Password.toHash' is a static method defined in the Password class that hashes a password.
        const hashed = await Password.toHash(this.get('password'));
        // 'this.set' is a Mongoose method that sets the value of a field in the document.
        // Here, it sets the 'password' field to the hashed password.
        this.set('password', hashed);
    }
    // 'done' is a callback function that needs to be called when the middleware function is done.
    // It signals to Mongoose that it can proceed with the save operation.
    done();
});

// Adding a static method to the user schema to build new User documents.
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

// Creating a Mongoose model for a User, based on the defined schema.
// The User model extends mongoose.Model with UserDoc and UserModel.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Exporting the User model.
export { User };
