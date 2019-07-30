const { check, validationResult } = require('express-validator');
const { getCategoryNames } = require('../data/categoriesData');

const { ValidationError } = require('./validationError');

async function getCategoriesByTitle(req) {
  try {
    const categoryNames = await getCategoryNames();
    Promise.all([
      await check('title')
        .not()
        .isEmpty()
        .withMessage('You must specify a title.')
        .run(req)
    ]);

    const invalid = validationResult(req);
    if (!invalid.isEmpty()) {
      const validationErrorPromise = new ValidationError(invalid.array());
      return Promise.reject(validationErrorPromise);
    }
    return true;
  } catch (error) {
    throw error;
  }
}
exports.getCategoriesByTitle = getCategoriesByTitle;
