const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const articlsValidation = require("../../validations/articls.validation");
const articlsController = require("../../controllers/articls.controller");

const router = express.Router();

router.post(
  "/",
  auth("manageUsers"),
  validate(articlsValidation.createArticl),
  articlsController.createArticl
);

router.get("/:id", articlsController.getArticlById);
router.get("/:field", articlsController.getAnyArticlFieldValue);
router.get("/", articlsController.getArticls);

router.patch(
  "/:id",
  auth("manageUsers"),
  validate(articlsValidation.updateArticl),
  articlsController.updateArticl
);
router.delete(
  "/:id",
  auth("manageUsers"),
  validate(articlsValidation.deleteArticl),
  articlsController.deleteArticl
);
module.exports = router;
