const Joi = require('joi');
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
})

const Author = mongoose.model('Author', authorSchema);

function validateAuthor(item) {
    if (item.length) {
        return Joi.array().items({
            name: Joi.string().min(3).max(50).required()
        }).validate(items);
    }

    return Joi.object({
        name: Joi.string().min(3).max(50).required(),
        bio: Joi.string().min(3).max(50),
    }).validate(item);
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