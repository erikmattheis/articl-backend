const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const categoriesValidation = require("../../validations/categories.validation");
const categoriesController = require("../../controllers/categories.controller");

const router = express.Router();

router.get(
  "/import-categories",
  categoriesController.importCategories
);
router.post(
  "/",
  auth("manageUsers"),
  validate(categoriesValidation.createCategories),
  categoriesController.createCategory
);
router.put(
  "/:id",
  auth("manageUsers"),
  validate(categoriesValidation.updateCategory),
  categoriesController.updateCategory
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
  "/:id",
  validate(categoriesValidation.getCategory),
  categoriesController.getCategory
);
router.delete(
  "/",
  auth("manageUsers"),
  validate(categoriesValidation.deleteCategory),
  categoriesController.deleteCategory
);

// router.get('/:id', auth(), validate(categoriesValidation.getUser), categoriesController.getCategory);

module.exports = router;
