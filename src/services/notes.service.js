const httpStatus = require("http-status");
const regexEscape = require("regex-escape");
const { Notes } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a note
 * @param {Object} noteBody
 * @returns {Promise<Note>}
 */
const createNote = async (noteBody) => {
  return Notes.create(noteBody);
};

/**
 * Query for notes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNotes = async (filter, options, projection = {}) => {
  console.log('am gerying notes')
  return Notes.paginate(filter, options, projection);
};

/**
 * Get note by id
 * @param {ObjectId} id
 * @returns {Promise<Note>}
 */
const getNoteById = async (id) => {
  return Notes.findById(id)
};

const updateSlugs = async (oldSlug,newSlug) => {
  const result = await Notes.updateMany({slug:oldSlug},{$set:{slug:newSlug}})
}

const getNotesBySlug = async (slug) => {
  return Notes.paginate({ slug },{populate:'author'}).project('fullText')
};

/**
 * Update note by id
 * @param {ObjectId} noteId
 * @param {Object} updateBody
 * @returns {Promise<Note>}
 */
const updateNoteById = async (noteId, updateBody) => {
  const note = await getNoteById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, "Note not found");
  }
  Object.assign(note, updateBody);
  await note.save();
  return note;
};

/**
 * Delete note by id
 * @param {ObjectId} id
 * @returns {Promise<Note>}
 */
const deleteNoteById = async (id) => {
  const note = await getNoteById(id);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, "Note not found");
  }
  await note.remove();
  return note;
};

module.exports = {
  createNote,
  queryNotes,
  updateSlugs,
  getNoteById,
  getNotesBySlug,
  updateNoteById,
  deleteNoteById,
};
