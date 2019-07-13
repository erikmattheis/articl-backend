const validate = require('./validate');

exports = {
  postQuestion: async (req, res, next) => {
    try {
      validate.validateQuestion(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  checkValidationResult: async (req, res, next) => {
    try {
      validate.validateResult(req, res, next);
    } catch (error) {
      next(error);
    }
  },
};
