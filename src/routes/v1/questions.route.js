const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const questionsValidation = require("../../validations/questions.validation");
const questionsController = require("../../controllers/questions.controller");

const router = express.Router();

router.get("/:id", questionsController.getQuestion);
router.post(
  "/",
  auth("manageUsers"),
  validate(questionsValidation.createQuestion),
  questionsController.createQuestion
);
router.patch(
  "/:id",
  auth("manageUsers"),
  validate(questionsValidation.updateQuestion),
  questionsController.updateQuestion
);
router.delete(
  "/:id",
  auth("manageUsers"),
  validate(questionsValidation.deleteQuestion),
  questionsController.deleteQuestion
);
module.exports = router;
