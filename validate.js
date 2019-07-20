const { check, validationResult } = require('express-validator');
const { getCategoriesNames, getAllCategories } = require('./mongoDBFunction');


function errorFormatter(error) {
  this.message = errror.msg;
  this.field = error.param;
  /*
  { value:
    [ { answer: 'ddddd',
        somethingWeDontWant: 'SOMETHIHG POTENTIALLY BAD FROM A BAD PERSON!',
        correct: true,
        explanation: "/?name=<script src='http://192.168.149.128/xss.js'>" },
      { answer: 'one',
        somethingWeDontWant: 'SOMETHIHG POTENTIALLY BAD FROM A BAD PERSON!',
        correct: true,
        explanation: "/xss_r/?name=<script src='http://192.168.149.128/xss.js'>" } ],
   msg: 'Your Q&A must have 1 correct answer, but now you have 2.',
   param: 'answers',
   location: 'body' }

   */


  console.log('unformatted', error);
}

async function checkValidationResult(req, res, next) {
  try {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      // console.log('validation errors are', errors.array());
      return new Error(errors.formatWith(errorFormatter).array());
    }
    return true;
  } catch (error) {
    // console.log('error in check result', error);
    return new Error(error);
  }
}

module.exports.postQuestion = async function postQuestion(req, res, next) {
  try {
    const validationChains = await Promise.all([check('author')
      .not()
      .isEmpty()
      .withMessage('Your Q&A must have a author.')
      .escape()
      .run(req),
    await check('category')
      .not()
      .isEmpty()
      .withMessage('Your Q&A must have category.')
      // .custom(async (value) => {
      //   let num = 0;
      //   const result = await getAllCategories();
      //   result.forEach((category) => {
      //     if (category.name === value) num += 1;
      //   });
      //   if (num < 1) {
      //     throw new Error(`Your category ${value} is wrong，`);
      //   } return true;
      // })
      // .withMessage('Your Q&A must be letters only.')
      .escape()
      .run(req),
    await check('question')
      .not()
      .isEmpty()
      .withMessage('Your Q&A must have question.')
      .isLength({ min: 5 })
      .withMessage('Your Q&A must have a question content at least five characters long.')
      .run(req),
    await check('answers.*.answer')
      .not()
      .isEmpty()
      .withMessage('Your Q&A must have an answer for each answer.')
      .run(req),
    await check('answers.*.correct')
      .not()
      .isEmpty()
      .withMessage('Your Q&A must have an correct tag for each answer.')
      .isBoolean()
      .withMessage('Your Q&A must be true or false.')
      .run(req),
    await check('answers.*.explanation')
      .not()
      .isEmpty()
      .withMessage('Your Q&A must have an explanation for each answer.')
      .run(req),
    await check('answers')
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
      })
      .run(req)]);
    // c
    // console.log('validationChains', validationChains);
    const result = await validationResult(req).throw();
    // console.log('validationResult result', result);
    return result;
  } catch (error) {
    // console.log('validate catch', error);
    return error.formatWith(errorFormatter).array();
  }
};


module.exports.getQuestions = async function getQuestions(req, res, next) {
  await check('id')
    .optional()
    .isMongoId()
    .withMessage('This is not a correct id')
    .run(req);
  await check('category')
    .escape()
    .run(req);

  await checkValidationResult(req, res, next);
};

// exports.getQuestions = [
//   check('id')
//     .optional()
//     .isMongoId()
//     .withMessage('This is not a correct id'),
//   check('category')
//     .escape(),
// ];

module.exports.deleteQuestions = async function deleteQuestions(req, res, next) {
  await check('id')
    .optional()
    .isMongoId()
    .withMessage('This is not a correct id')
    .run(req);

  await checkValidationResult(req, res, next);
};

// exports.deleteQuestions = [
//   check('id')
//     .optional()
//     .isMongoId()
//     .withMessage('This is not a correct id'),
// ];

// exports.checkValidationResult = checkValidationResult;
