/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const passport = require("passport");
const config = require("../config/config");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const {
  textFilter,
  yearFilter,
  regexFilter,
  stringToArrayFilter,
} = require("../utils/searchFilters");
const { stringNearSubstring } = require("../utils/stringFunctions");
const { notesService } = require("../services");

const createNote = catchAsync(async (req, res) => {
  req.body.author = req.user.id;
  const note = await notesService.createNote(req.body);
  res.status(httpStatus.CREATED).send(note);
});

const getNotes = catchAsync(async (req, res) => {
  let filter = pick(req.query, [
    "slug",
    "author",
  ]);

  let originalFilterValues = Object.assign({ ...filter });

  filter = makeNotesFilter(filter);

  let options = pick(req.query, ["sortBy", "limit", "page"]);
  options.sortBy = options.sortBy ? options.sortBy : "createdAt:desc"
  options = makeNotesOptions(options);
  options.populate = 'author';
  const project = { 'nameFirst': true, 'fullText': true };

  const result = await notesService.queryNotes(filter, options, project);

  res.send(result);
});

function makeNotesOptions(options) {
  options.sortBy = options.sortBy ? options.sortBy : "createdAt:desc";
  options.limit = options.limit ? Number(options.limit) : 10;
  options.page = options.page ? Number(options.page) : 1;
  options.populate = { path: 'author' };

  return options;
}

function makeNotesFilter(filter) {
  if (filter.text) {
    filter.$text = textFilter(filter.text);
    delete filter.text;
  }
  if (filter.author) {
    filter.authors = regexFilter(filter.author);
  }
  return filter;
}

const getNoteById = catchAsync(async (req, res) => {
  const note = await notesService.getNoteById(req.params.id);
  res.send(note);
});

const updateNote = catchAsync(async (req, res) => {
  const note = await notesService.updateNoteById(req.params.id, req.body);
  res.send(note);
});

const deleteNote = catchAsync(async (req, res) => {
  await notesService.deleteNoteById(req.body.id);
  res.send();
});

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
