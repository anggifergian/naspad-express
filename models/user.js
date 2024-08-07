require('dotenv').config();
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { getEnvVar } = require('../utils/config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, getEnvVar('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(item) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });

    return schema.validate(item);
}

function validateLogin(item) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    });

    return schema.validate(item);
}

module.exports = {
    User,
    validateUser,
    validateLogin,
}