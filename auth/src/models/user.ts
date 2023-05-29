import mongoose from "mongoose";  // Importing mongoose to interact with MongoDB.

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
