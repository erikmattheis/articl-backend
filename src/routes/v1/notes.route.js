const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const notesValidation = require("../../validations/notes.validation");
const notesController = require("../../controllers/notes.controller");

const router = express.Router();

router.get("/", notesController.getNotes);


router.post(
  "/",
  auth("manageUsers"),
  validate(notesValidation.createNote),
  notesController.createNote
);

router.get(
  "/:id",
  validate(notesValidation.getNoteById),
  notesController.getNoteById
);


router.patch(
  "/:id",
  auth("manageUsers"),
  validate(notesValidation.updateNote),
  notesController.updateNote
);

router.delete(
  "/",
  auth("manageUsers"),
  validate(notesValidation.deleteNote),
  notesController.deleteNote
);

module.exports = router;
