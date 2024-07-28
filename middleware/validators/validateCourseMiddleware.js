const BadRequestError = require("../../errors/badRequestError");
const { validateCourse } = require("../../models/course");
const { modify } = require("../../utils/response");

module.exports.validateCourseBody = (req, res, next) => {
  const { error } = validateCourse(req.body);

  if (error) {
    return next(new BadRequestError(modify(error['details'][0]['message'])));
  }

  next();
}