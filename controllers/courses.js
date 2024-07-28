const express = require('express');
const router = express.Router();

const { Course } = require('../models/course');
const { Author } = require('../models/author');

const { sendResponse } = require('../utils/response');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const authMiddleware = require('../middleware/auth');
const { validateID, validateAuthorID } = require('../middleware/validators/validateIDMiddleware');
const { validateCourseBody } = require('../middleware/validators/validateCourseMiddleware');
const { validateAuthorBody } = require('../middleware/validators/validateAuthorMiddleware');

router.get('/', async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const courses = await Course.find()
            .select('name author tags isPublished price authors')
            .skip((page - 1) * limit)
            .limit(10)
            .sort('date')
            .populate('authors');

        sendResponse(res, {
            message: courses.length > 0 ? 'Data found' : 'Empty list',
            data: courses,
        });
    } catch (error) {
        next(error);
    }
})

router.get('/:id', validateID, async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            throw new NotFoundError('Data not found');
        }

        sendResponse(res, { message: 'Data found', data: course });
    } catch (error) {
        next(error);
    }
})

router.post('/', authMiddleware, validateCourseBody, async (req, res, next) => {
    try {
        const { authors, name, category, isPublished, tags, price } = req.body;

        const authorDocs = await Author.find({ _id: { $in: authors }});
        if (authorDocs.length !== authors.length) throw new BadRequestError('One or more authors are invalid.');

        const course = new Course({
            name,
            category,
            tags,
            price,
            isPublished,
            authors,
        });

        const savedCourse = await course.save();

        sendResponse(res, { message: 'Data created', data: savedCourse });
    } catch (error) {
        next(error);
    }
})

router.patch('/add-author/:id', authMiddleware, validateID, validateAuthorBody, async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) throw new BadRequestError('The course with the given ID was not found.');

        const author = new Author({ name: req.body.name });
        const savedAuthor = await author.save();

        course.authors.push(savedAuthor._id);
        const savedCourse = await course.save();

        sendResponse(res, { message: 'Author has been added successfuly.', data: savedCourse });
    } catch (error) {
        next(error);
    }
})

router.patch('/remove-author/:id', authMiddleware, validateID, validateAuthorID, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { authorId } = req.body;

        const course = await Course.findById(id);
        if (!course) throw new BadRequestError('The course with the given ID was not found.');

        const authorIndex = course.authors.indexOf(authorId);
        if (authorIndex === -1) throw new NotFoundError('The author with the given ID was not found in this course.');

        course.authors.pull(authorId);
        const savedCourse = await course.save();

        sendResponse(res, { message: 'Author has been removed successfuly.', data: savedCourse });
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', authMiddleware, validateID, async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndRemove(id);
        if (!course) throw new NotFoundError('The course with the given ID was not found.');

        sendResponse(res, { message: 'The course with the given ID has been deleted successfully.', data: course });
    } catch (error) {
        next(error);
    }
})

module.exports = router;