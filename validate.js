const { check, validationResult } = require('express-validator');
const { getCategoriesNames, getAllCategories } = require('./mongoDBFunction');


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


// module.exports.postQuestion = async function postQuestion(req, res, next) {
//   await check('author')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have a author.')
//     .escape();
//   await check('name')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have a name.')
//     .isLength({ min: 5 })
//     .withMessage('Your Q&A must have a name at least five characters long.')
//     .escape();
//   await check('category')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have category.')
//     .custom(async (value) => {
//       let num = 0;
//       const result = await getAllCategories();
//       result.forEach((category) => {
//         if (category.name === value) num += 1;
//       });
//       if (num < 1) {
//         throw new Error(`Your category ${value} is wrong，`);
//       } return true;
//     })
//     .isAlpha()
//     .withMessage('Your Q&A must be letters only.')
//     .escape();
//   await check('question.question')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have question.')
//     .isLength({ min: 5 })
//     .withMessage('Your Q&A must have a question content at least five characters long.');
//   await check('question.answers.*.answer')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have an answer for each answer.');
//   await check('question.answers.*.correct')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have an correct tag for each answer.')
//     .isBoolean()
//     .withMessage('Your Q&A must be true or false.');
//   await check('question.answers.*.explanation')
//     .not()
//     .isEmpty()
//     .withMessage('Your Q&A must have an explanation for each answer.');
//   await check('question.answers')
//     .custom((value) => {
//       if (value.length < 2) {
//         throw new Error('Your Q&A must have 2 answers.');
//       } return true;
//     })
//     .custom((value) => {
//       let num = 0;
//       value.forEach((item) => {
//         if (item.correct === true || item.correct === 1) num += 1;
//       });
//       if (num !== 1) {
//         throw new Error(`Your Q&A must have 1 correct answer, but now you have ${num}.`);
//       } return true;
//     });

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(422).json({ errors: errors.array() });
//   } else {
//     next();
//   }
// };


module.exports.postQuestionTest = async function postQuestion(req, res, next) {
  console.log('test sataty');
  await check('author')
    .not()
    .isEmpty()
    .run(req);
};

module.exports.postQuestion = [
  check('author')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have a author.')
    .escape(),
  check('category')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have category.')
    .custom(async (value) => {
      let num = 0;
      const result = await getAllCategories();
      result.forEach((category) => {
        if (category.name === value) num += 1;
      });
      if (num < 1) {
        throw new Error(`Your category ${value} is wrong，`);
      } return true;
    })
    .isAlpha()
    .withMessage('Your Q&A must be letters only.')
    .escape(),
  check('question.question')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have question.')
    .isLength({ min: 5 })
    .withMessage('Your Q&A must have a question content at least five characters long.'),
  check('question.answers.*.answer')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have an answer for each answer.'),
  check('question.answers.*.correct')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have an correct tag for each answer.')
    .isBoolean()
    .withMessage('Your Q&A must be true or false.'),
  check('question.answers.*.explanation')
    .not()
    .isEmpty()
    .withMessage('Your Q&A must have an explanation for each answer.'),
  check('question.answers')
    .custom((value) => {
      if (value.length < 2) {
        throw new Error('Your Q&A must have 2 answers.');
      } return true;
    })
    .custom((value) => {
      let num = 0;
      value.forEach((item) => {
        if (item.correct === true || item.correct === 1) num += 1;
      });
      if (num !== 1) {
        throw new Error(`Your Q&A must have 1 correct answer, but now you have ${num}.`);
      } return true;
    }),
];


exports.getQuestions = [
  check('id')
    .optional()
    .isMongoId()
    .withMessage('This is not a correct id'),
  check('name')
    .optional()
    .isAlpha()
    .withMessage('Your Q&A must be letters only.')
    .escape(),
  check('category')
    .optional()
    .isAlpha()
    .withMessage('Your Q&A must be letters only.')
    .escape(),
];

exports.deleteQuestions = [
  check('id')
    .optional()
    .isMongoId()
    .withMessage('This is not a correct id'),
];

// exports.checkValidationResult = checkValidationResult;
