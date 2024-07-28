const Joi = require('joi');
const mongoose = require('mongoose');

const min_title_length = 3;
const max_title_length = 255;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: min_title_length,
        maxlength: max_title_length,
    },
    price: {
        type: Number,
        default: 0,
        max: 99_999_999
    },
    imageUrl: {
        type: String,
        default: '',
    },
    categories: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        }],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A product should have at least one category.'
        },
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const Product = mongoose.model('Product', productSchema);

function validateProduct(data) {
    const shcema = Joi.object({
        title: Joi
            .string()
            .min(min_title_length)
            .max(max_title_length)
            .required(),
        price: Joi.number().max(99_999_999),
        imageUrl: Joi.string(),
        categories: Joi
            .array()
            .items(Joi.object({ id: Joi.objectId() }))
            .required(),
    });

    return shcema.validate(data);
}

function mapCategories(items) {
    return items.map(item => item['id']);
}

function compareCategories(fromReq, fromDb) {
    const invalidIDs = [];

    fromReq.filter(objectID => {
        const isExist = fromDb.find(category => category._id.equals(objectID));

        if (!isExist) {
            invalidIDs.push(objectID);
        }
    });

    return invalidIDs;
}

module.exports = {
    Product,
    validateProduct,
    mapCategories,
    compareCategories,
}