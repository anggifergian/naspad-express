const mongoose = require('mongoose');
const Joi = require('joi');

const { authorSchema } = require('./author');

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    category: {
        type: String,
        required: true,
        enum: [ 'web', 'mobille', 'networkd' ],
    },
    authors: [authorSchema],
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
        isPublished: Joi.boolean().required(),
        category: Joi.string().required(),
        authors: Joi.array(),
        tags: Joi.array().items(Joi.string()),
        price: Joi.number(),
    });

    return schema.validate(data);
}

module.exports = {
    Course,
    validateCourse,
}