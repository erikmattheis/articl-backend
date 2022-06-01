const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const articlsValidation = require("../../validations/articls.validation");
const articlsController = require("../../controllers/articls.controller");

const router = express.Router();

router.get("/", articlsController.getArticls);

router.post(
  "/",
  auth("manageUsers"),
  validate(articlsValidation.createArticl),
  articlsController.createArticl
);

router.get(
  "/:id",
  auth("manageUsers"),
  validate(articlsValidation.getArticlById),
  articlsController.updateArticl
);

router.post(
  "/order",
  auth("manageUsers"),
  validate(articlsValidation.updateArticlsOrder),
  articlsController.updateArticlsOrder
);

router.put(
  "/:id",
  auth("manageUsers"),
  validate(articlsValidation.updateArticl),
  articlsController.updateArticl
);

router.delete(
  "/",
  auth("manageUsers"),
  validate(articlsValidation.deleteArticl),
  articlsController.deleteArticl
);

router.get("/values/:field", articlsController.getAnyArticlFieldValue);

module.exports = router;
