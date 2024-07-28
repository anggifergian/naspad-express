const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const authorSchema = new mongoose.Schema({
    name: { type: String, require: true },
    bio: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const Author = mongoose.model('Author', authorSchema);

function validateAuthor(item) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        bio: Joi.string().min(3).max(50).optional(),
    });

    if (Array.isArray(item)) {
        return Joi.array().items(schema).validate(item);
    }

    return schema.validate(item);
}

function mapAuthors(items) {
    return items.map(item => ({
        name: item['name'],
        bio: item['bio'],
    }));
}

module.exports = {
    Author,
    authorSchema,
    validateAuthor,
    mapAuthors,
}