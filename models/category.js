"use strict";

const mongoose = require('mongoose')
const moment = require('moment')
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid')

const Category = mongoose.model("Category", new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55,
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format("YYYY-MM-DD, HH:mm:ss")
    }
}));

function validateCategory(data) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(55).required(),
    });

    return schema.validate(data);
}

module.exports = {
    Category,
    validateCategory,
}
