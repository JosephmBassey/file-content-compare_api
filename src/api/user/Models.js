import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { compare, hash } from 'bcryptjs';


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },


}, { timestamps: true });
userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 12)
    }
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
            id: this._id,
            username: this.username,
        },
        process.env.JWT_USER_SK, { expiresIn: "1h" }
    );

    return token;
};


const UserModel = mongoose.model('User', userSchema);

export default UserModel;