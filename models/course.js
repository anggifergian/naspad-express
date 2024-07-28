const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const courseSchema = new mongoose.Schema({
    name: String,
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        require: true
    }],
    tags: {
        type: [String],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag.'
        },
    },
    date: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    price: {
        type: Number,
        required: function () { return this.isPublished; },
        min: 5,
        max: 1000,
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const Course = mongoose.model('Course', courseSchema);

function validateCourse(data) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        category: Joi.string().valid('web', 'mobile', 'network').required(),
        authors: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).required(),
        tags: Joi.array().items(Joi.string()).min(1).required(),
        isPublished: Joi.boolean(),
        price: Joi.when('isPublished', {
            is: true,
            then: Joi.number().min(5).max(1000).required(),
            otherwise: Joi.number().optional(),
        }),
    });

    return schema.validate(data);
}

module.exports = {
    Course,
    validateCourse,
}