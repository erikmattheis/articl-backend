const express = require("express");
const auth = require("../../middlewares/auth");
const importsController = require("../../controllers/imports.controller");

const router = express.Router();

router.get(
  "/duplicate-categories",
  auth(),
  importsController.getCategoriesWithDuplicatedSlugs
);

router.get(
  "/import-categories",
  auth(),
  importsController.importCategories
);

router.get(
  "/import-articls/reset",
  auth(),
  importsController.resetAllImportFlags
);

router.get(
  "/import-articls/all",
  auth(),
  importsController.importAllArticls
);

router.get(
  "/import-articls/:chr",
  auth(),
  importsController.importArticlsByChr
);

router.get(
  "/import-notes/:chr",
  auth(),
  importsController.importNotesByChr
);

router.get(
  "/import-notes",
  auth(),
  importsController.importNotes
);

module.exports = router;
