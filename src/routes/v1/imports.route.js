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

router.get(
  "/import-articls",
  importsController.importArticls
);

router.get(
  "/import-notes/:chr",
  importsController.importNotesByChr
);

router.get(
  "/import-notes",
  importsController.importNotes
);

module.exports = router;
