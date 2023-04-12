const express = require('express');
const router = express.Router();

const { sendResponse } = require('../utils/response');
const { isValidID } = require('../utils/mongoose');
const { Course, validateCourse } = require('../models/course');

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .select('name author tags isPublished price')
            .limit(10)
            .sort('date');

        sendResponse(res, {
            message: courses.length > 0 ? 'Data found' : 'Empty list',
            data: courses,
        });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const course = await Course.findById(id);

        if (!course) {
            return sendResponse(res, { statusCode: 404, message: 'Data not found' });
        }

        sendResponse(res, { message: 'Data found', data: course });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.post('/', async (req, res) => {
    try {
        const { error } = validateCourse(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        console.log('body...', req.body)

        let course = new Course({
            name: req.body.name,
            author: req.body.author,
            isPublished: req.body.isPublished,
            tags: req.body.tags,
            price: req.body.price,
        })
        course = await course.save();

        sendResponse(res, { message: 'Data created', data: course });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });   
    }
})

module.exports = router;