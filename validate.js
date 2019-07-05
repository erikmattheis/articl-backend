const { check, validationResult } = require('express-validator');

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
  check('question.question')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have question.'),
  check('question.answers')
    .custom((value) => {
      if (value.length < 2) {
        throw new Error('Your Q&A must have 2 answers.');
      } return true;
    })
    .custom((value) => {
      let num = 0;
      value.forEach((item) => {
        if (item.correct === true) num += 1;
      });
      if (num !== 1) {
        throw new Error(`Your Q&A must have 1 correct answer, but now you have ${num}.`);
      } return true;
    })
    .custom((value) => {
      value.forEach((item) => {
        if (item.explanation === null) throw new Error('Your Q&A must have explanation for each answer.');
      });
      return true;
    }),
];

// exports.getQuestions = [
//   check('category')
//     .not()
//     .isEmpty()
//     .isIn()
//     .withMessage('The category does not exist.'),
// ];


// exports.checkValidationResult = checkValidationResult;
