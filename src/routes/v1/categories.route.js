const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoriesValidation = require('../../validations/categories.validation');
const categoriesController = require('../../controllers/categories.controller');

const router = express.Router();

router.post('/', auth('manageUsers'), validate(categoriesValidation.createCategories), categoriesController.createCategory);
router.get(
  '/:slug',
  auth('manageUsers'),
  validate(categoriesValidation.getCategoryPage),
  categoriesController.getCategoryPage
);
// router.get('/:id', auth(), validate(categoriesValidation.getUser), categoriesController.getCategory);

module.exports = router;
