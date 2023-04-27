const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const categoriesValidation = require("../../validations/categories.validation");
const categoriesController = require("../../controllers/categories.controller");

const router = express.Router();

router.post(
  "/ai-summary",
  auth("manageContent"),
  validate(categoriesValidation.getAISummary),
  categoriesController.getAISummary
);
router.post(
  "/",
  auth("manageContent"),
  validate(categoriesValidation.createCategories),
  categoriesController.upsertCategory
);
router.put(
  "/:id",
  auth("manageContent"),
  validate(categoriesValidation.updateCategory),
  categoriesController.upsertCategory
);
router.post(
  "/order",
  auth("manageContent"),
  validate(categoriesValidation.updateCategoriesOrder),
  categoriesController.updateCategoriesOrder
);
router.get(
  "/titles",
  validate(categoriesValidation.getCategorySlugs),
  categoriesController.getCategorySlugs
);
router.get(
  "/:id",
  validate(categoriesValidation.getCategory),
  categoriesController.getCategory
);
router.get(
  "/",
  validate(categoriesValidation.getCategoryBySlug),
  categoriesController.getCategoryBySlug
);
router.delete(
  "/",
  auth("manageContent"),
  validate(categoriesValidation.deleteCategory),
  categoriesController.deleteCategory
);

// router.get('/:id', auth(), validate(categoriesValidation.getUser), categoriesController.getCategory);

module.exports = router;
