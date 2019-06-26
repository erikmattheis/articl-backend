const { check, validationResult } = require('express-validator');

exports.postQuestion = [
  check('name')
    .isEmpty()
    .withMessage('Your Q&A must have a name.')
    .isLength({ min: 5 })
    .withMessage('Your Q&A must have a name at least five characters long.'),
  check('category')
    .isEmpty()
    .withMessage('Your Q&A must have category.'),
  function checkValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      next();
    }
  }
];

// exports.checkValidationResult = checkValidationResult;
