const validate = require('./validate');

// exports = {
//   postQuestion: async (req, res, next) => {
//     try {
//       validate.postQuestionTest(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   },
//   checkValidationResult: async (req, res, next) => {
//     try {
//       validate.checkValidationResult(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   },
// };

module.exports.postQuestion = async function postQuestion(req, res, next) {
  try {
    validate.postQuestionTest(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports.checkValidationResult = async function checkValidationResult(req, res, next) {
  try {
    validate.checkResult(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports.asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};
