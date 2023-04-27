const express = require("express");
const auth = require("../../middlewares/auth");
const importsController = require("../../controllers/imports.controller");

const router = express.Router();



router.get(
  "/duplicate-categories",
  auth("manageContent"),
  importsController.getCategoriesWithDuplicatedSlugs
);

router.get(
  "/import-categories",
  auth("manageContent"),
  importsController.importCategories
);

router.get(
  "/import-articls/reset",
  auth("manageContent"),
  importsController.resetAllImportFlags
);

router.get(
  "/import-articls/all",
  auth("manageContent"),
  importsController.importAllArticls
);

router.get(
  "/import-articls/:chr",
  auth("manageContent"),
  importsController.importArticlsByChr
);

router.get(
  "/import-notes/:chr",
  auth("manageContent"),
  importsController.importNotesByChr
);

router.get(
  "/import-notes",
  auth("manageContent"),
  importsController.importNotes
);

module.exports = router;
