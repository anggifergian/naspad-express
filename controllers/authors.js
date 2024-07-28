const express = require('express');
const router = express.Router();

const { Author } = require('../models/author');
const { sendResponse } = require('../utils/response');

const authMiddleware = require('../middleware/auth');
const { validateID } = require('../middleware/validators/validateIDMiddleware');
const { validateAuthorBody } = require('../middleware/validators/validateAuthorMiddleware');

router.get('/', async (req, res, next) => {
  try {
    const data = await Author.find();

    sendResponse(res, { message: data.length > 0 ? 'Data found' : 'Empy list', data });
  } catch (error) {
    next(error);
  }
})

router.post('/', authMiddleware, validateAuthorBody, async (req, res, next) => {
  try {
    const author = new Author(req.body);
    const savedAuthor = await author.save();

    sendResponse(res, { message: 'Author created successfully.', data: savedAuthor });
  } catch (error) {
    next(error);
  }
})

router.delete('/:id', authMiddleware, validateID, async (req, res, next) => {
  try {
    const { id } = req.params;

    const author = await Author.findByIdAndRemove(id);
    if (!author) throw new NotFoundError('The author with the given ID was not found.');

    sendResponse(res, { message: 'The author with the given ID has been deleted successfully.', data: author });
  } catch (error) {
    next(error);
  }
})

module.exports = router;