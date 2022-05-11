const httpStatus = require("http-status");
const { Articls } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a articl
 * @param {Object} articlBody
 * @returns {Promise<Articl>}
 */
const createArticl = async (articlBody) => {
  return Articls.create(articlBody);
};

/**
 * Query for articls
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryArticls = async (filter, options) => {
  return Articls.paginate(filter, options);
};

/**
 * Get articl by id
 * @param {ObjectId} id
 * @returns {Promise<Articl>}
 */
const getArticlById = async (id) => {
  return Articls.findById(id);
};

const getAnyArticlFieldValue = async (field, value) => {
  //let regex = new RegExp(value, "i");
  //const arg = { [field]: { $regex: regex } };

  const regex = new RegExp(value, "i");
  const arg = { [field]: { $regex: regex } };
  console.log("field,vvalue", field, value);
  const result = await Articls.distinct(field, arg);
  //const result = fields.map(({ id, [field]: value }) => ({ id, value }));
  console.log("result", result);
  // output
  //slugs = prepareForTypeahead(slugs);
  return Promise.resolve(result);
};

const getArticlsBySlug = async (slug) => {
  return Articls.find({ categorySlug: slug });
};

/**
 * Update articl by id
 * @param {ObjectId} articlId
 * @param {Object} updateBody
 * @returns {Promise<Articl>}
 */
const updateArticlById = async (articlId, updateBody) => {
  const articl = await getArticlById(articlId);
  if (!articl) {
    throw new ApiError(httpStatus.NOT_FOUND, "Articl not found");
  }
  Object.assign(articl, updateBody);
  await articl.save();
  return articl;
};

/**
 * Delete articl by id
 * @param {ObjectId} id
 * @returns {Promise<Articl>}
 */
const deleteArticlById = async (id) => {
  const articl = await getArticlById(id);
  if (!articl) {
    throw new ApiError(httpStatus.NOT_FOUND, "Articl not found");
  }
  await articl.remove();
  return articl;
};

module.exports = {
  createArticl,
  queryArticls,
  getAnyArticlFieldValue,
  getArticlById,
  getArticlsBySlug,
  updateArticlById,
  deleteArticlById,
};
