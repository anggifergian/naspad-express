const mongoose = require('mongoose');
const Joi = require('joi');

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
}))

function validateCourse(data) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        author: Joi.string().min(3).max(255),
        tags: Joi.array().items(Joi.string()),
        isPublished: Joi.boolean().required(),
    });

    return schema.validate(data);
}

module.exports = {
    Course,
    validateCourse,
}