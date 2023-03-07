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
  return Notes.paginate(filter, options, projection);
};

/**
 * Get note by id
 * @param {ObjectId} id
 * @returns {Promise<Note>}
 */
const getNoteById = async (id) => {
  return Notes.findById(id).populate('author').exec();
};

const updateSlugs = async (slug,oldSlug) => {
  return Notes.updateMany({slug:oldSlug},{$set:{slug:slug}})
}

const getNotesBySlug = async (slug) => {
  const notes = await Notes.find({ slug }).populate('author').exec();
  return notes;

  //return Notes.paginate({ slug },{populate:'author'}).project('fullText slug').exec()
};

/**
 * Update note by id
 * @param {ObjectId} noteId
 * @param {Object} updateBody
 * @returns {Promise<Note>}
 */
const updateNoteById = async (id, updateBody, userId) => {
  const note = await getNoteById(id);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, "Note not found");
  }
  if (note.user?.id !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to update this note.");
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
  if (note.user?.id !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to update this note.");
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
