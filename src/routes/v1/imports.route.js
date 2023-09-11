const express = require("express");
const auth = require("../../middlewares/auth");
const importsController = require("../../controllers/imports.controller");

const router = express.Router();

router.get(
  "/duplicate-categories",
  auth('nobody'),
  importsController.getCategoriesWithDuplicatedSlugs
);

router.get(
  "/import-articls/reset",
  auth('nobody'),
  importsController.resetAllImportFlags
);

router.get(
  "/import-articls/batch",
  auth('nobody'),
  importsController.importArticlsFromLocalWP
);

router.get(
  "/import-categories",
  auth('nobody'),
  importsController.importCategories
);

router.get(
  "/import-articls/all",
  auth('nobody'),
  importsController.importAllArticls
);

router.get(
  "/import-articls/:chr",
  auth('nobody'),
  importsController.importArticlsByChr
);

router.get(
  "/import-notes/:chr",
  auth('nobody'),
  importsController.importNotesByChr
);

router.get(
  "/import-notes",
  auth('nobody'),
  importsController.importNotes
);

module.exports = router;
