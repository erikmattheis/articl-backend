const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const articlPagesValidation = require('../../validations/articlPages.validation');
const articlPagesController = require('../../controllers/articlPages.controller');

const router = express.Router();

router.get('/',  articlPagesController.getHomePage);
router.get(
  '/:slug',
  validate(articlPagesValidation.getCategoryPage),
  articlPagesController.getArticlPage
);

module.exports = router;
