const mongoose = require('mongoose');
const Joi = require('joi');

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag.'
        },
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        min: 5,
        max: 1000,
    }
}))

function validateCourse(data) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        author: Joi.string().min(3).max(255),
        tags: Joi.array().items(Joi.string()),
        isPublished: Joi.boolean().required(),
        price: Joi.number(),
    });

    return schema.validate(data);
}

module.exports = {
    Course,
    validateCourse,
}