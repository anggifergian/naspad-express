"use strict";

const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

const Product = mongoose.model('Product', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    price: {
        type: Number,
        default: 0,
        max: 99_999_999
    },
    imageUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format("YYYY-MM-DD, HH:mm:ss")
    }
}));

function validateProduct(data) {
    const shcema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        price: Joi.number().max(99_999_999),
        imageUrl: Joi.string(),
    });

    return shcema.validate(data);
}

module.exports = {
    Product,
    validateProduct,
}