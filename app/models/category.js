"use strict"

const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format("YYYY-MM-DD, HH:mm:ss")
    }
})

const Category = mongoose.model("Category", categorySchema)

module.exports = {
    Category
}
