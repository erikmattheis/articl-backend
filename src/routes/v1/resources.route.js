const express = require("express");
const validate = require("../../middlewares/validate");
const resourcesValidation = require("../../validations/resources.validation");
const resourcesController = require("../../controllers/resources.controller");

const router = express.Router();
resourcesController
router.get("/", resourcesController.getHomePage);

router.get(
  "/:slug",
  validate(resourcesValidation.getArticlPage),
  resourcesController.getArticlPage
);

module.exports = router;
