const express = require('express');
const router = express.Router();

const { sendResponse } = require('../utils/response');
const { isValidID } = require('../utils/mongoose');
const { Course, validateCourse } = require('../models/course');
const { Author, validateAuthor, mapAuthors } = require('../models/author');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .select('name author tags isPublished price authors')
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

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { error: authorError } = validateAuthor(req.body.author);
        if (authorError) {
            const errMessage = authorError.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const { error: courseError } = validateCourse(req.body);
        if (courseError) {
            const errMessage = courseError.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const mappedAuthors = mapAuthors(req.body.authors)

        let course = new Course({
            name: req.body.name,
            category: req.body.category,
            authors: mappedAuthors,
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

router.patch('/add-author/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid course Id.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let course = await Course.findById(id);

        if (!course) {
            const errMessage = 'The course with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        const { error } = validateAuthor(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }
        
        const author = new Author({ name: req.body.name });
        course.authors.push(author);
        
        course = await course.save();

        sendResponse(res, { message: 'Author has been added successfuly.', data: course });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.patch('/remove-author/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid course Id.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let course = await Course.findById(id);

        if (!course) {
            const errMessage = 'The course with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        if (!isValidID(req.body.authorId)) {
            const errMessage = 'Please input valid author Id.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const author = course.authors.id(req.body.authorId);

        if (!author) {
            const errMessage = 'The author with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        author.remove();
        course = await course.save();

        sendResponse(res, { message: 'Author has been removed successfuly.', data: course });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const course = await Course.findByIdAndRemove(id);

        if (!course) {
            const errMessage = 'The course with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        const successMessage = 'The course with the given ID has been deleted successfully.';
        sendResponse(res, { message: successMessage, data: course });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;