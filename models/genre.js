const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(value) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50)
    })

    return schema.validate(value)
}

module.exports = {
    Genre,
    genreSchema,
    validateGenre,
}