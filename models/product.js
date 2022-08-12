"use strict";

const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format("YYYY-MM-DD, HH:mm:ss")
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = {
    Product
}