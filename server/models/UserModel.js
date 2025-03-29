import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required' ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required' ],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    fullName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
})

userSchema.pre('save', async function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

export const User = mongoose.model('User', userSchema);

export default User;