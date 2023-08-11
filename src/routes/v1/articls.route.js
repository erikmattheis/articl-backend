const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const articlsValidation = require("../../validations/articls.validation");
const articlsController = require("../../controllers/articls.controller");
const aiService = require("../../services/ai.service");

const router = express.Router();

router.get("/search", validate(articlsValidation.searchByWeight), articlsController.searchByWeight);  

router.get(
  "/:id",
  validate(articlsValidation.getArticlById),
  articlsController.getArticlById
);

router.get("/", articlsController.getArticls);

router.post(
  "/",
  auth(),
  validate(articlsValidation.createArticl),
  articlsController.createArticl 
);

router.post(
  "/order",
  auth(),
  validate(articlsValidation.updateArticlsOrder),
  articlsController.updateArticlsOrder
);

router.put(
  "/:id",
  auth(),
  validate(articlsValidation.updateArticl),
  articlsController.updateArticl
);

router.delete(
  "/",
  auth(),
  validate(articlsValidation.deleteArticl),
  articlsController.deleteArticl
);

router.get("/values/:field", articlsController.getAnyArticlFieldValue);

module.exports = router;
