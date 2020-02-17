import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mongoose from 'mongoose';
import crypto from 'crypto';



const contentSchema = new mongoose.Schema({
    firstStudentFilePath: {
        type: String,
        required: true,
    },
    secondStudentFilePath: {
        type: String,
        required: true,
    },
    contentFeedBack: {
        type: String,
        required: true,

    },
    firstStudentName: {
        type: String,
        required: true,
    },
    secondStudentName: {
        type: String,
        required: true,
    },
    recheck:{
        type: Boolean,
        default: false
    }

}, { timestamps: true });
contentSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 12)
    }
});
contentSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
            id: this._id,
            email: this.email,
        },
        process.env.JWT_ContentModel_SK
    );
    return token;
};



const ContentModel = mongoose.model('Content', contentSchema);

function validateContent(content) {
    const schema = {
        firstStudentName: Joi.string()
            .min(2)
            .max(50)
            .required().error(() => {
                return {
                    message: 'firstStudentName field  is required.',
                };
            }),
        secondStudentName: Joi.string()
            .min(2)
            .max(50)
            .required().error(() => {
                return {
                    message: 'secondStudentName field is required.',
                };
            }),
        firstStudentFile: Joi.any(),
        secondStudentFile: Joi.any()
    };

    return Joi.validate(content, schema);
}




exports.ContentModel = ContentModel;
exports.validateContent = validateContent;