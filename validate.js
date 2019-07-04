const { check, checkBody, validationResult } = require('express-validator');

function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
}
exports.checkValidationResult = checkValidationResult;
/*
exports.validateJSON = [check().isJSON(), checkValidationResult];
*/


exports.postQuestion = [
  check('author')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have a author.'),
  check('name')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have a name.')
    .isLength({ min: 5 })
    .withMessage('Your Q&A must have a name at least five characters long.'),
  check('category')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have category.'),
  check('question.question')// won't work
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have question.'),
];

// exports.getQuestions = [
//   check('category')
//     .not()
//     .isEmpty()
//     .isIn()
//     .withMessage('The category does not exist.'),
// ];


// exports.checkValidationResult = checkValidationResult;
