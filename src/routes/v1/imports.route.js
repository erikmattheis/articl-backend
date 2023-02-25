const express = require("express");
const auth = require("../../middlewares/auth");
const importsController = require("../../controllers/imports.controller");

const router = express.Router();

router.get(
  "/import-categories",
  importsController.importCategories
);

router.get(
  "/import-articls/:chr",
  importsController.importArticlsByChr
);

module.exports = router;
