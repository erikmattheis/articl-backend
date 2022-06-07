const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const categoriesValidation = require("../../validations/categories.validation");
const categoriesController = require("../../controllers/categories.controller");

const router = express.Router();

router.post(
  "/import-categories",
  auth(),
  categoriesController.importCategories
);
router.post(
  "/",
  auth("manageUsers"),
  validate(categoriesValidation.createCategories),
  categoriesController.createCategory
);
router.post(
  "/order",
  auth("manageUsers"),
  validate(categoriesValidation.updateCategoriesOrder),
  categoriesController.updateCategoriesOrder
);
router.get(
  "/titles",
  validate(categoriesValidation.getCategorySlugs),
  categoriesController.getCategorySlugs
);
router.get(
  "/:slug",
  validate(categoriesValidation.getCategoryPage),
  categoriesController.getCategoryPage
);
// router.get('/:id', auth(), validate(categoriesValidation.getUser), categoriesController.getCategory);

module.exports = router;
