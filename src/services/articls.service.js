const httpStatus = require("http-status");
const { Articls } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a articl
 * @param {Object} articlBody
 * @returns {Promise<Articl>}
 */
const createArticl = async (articlBody) => {
  return Articl.create(articlBody);
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
  const articls = await Articls.paginate(filter, options);
  return articls;
};

const getArticlFields = async (field, value) => {
  const arg = { [field]: { $regex: `^${value}`, $options: "i" } };
  //{ [field]: 1 }
  console.log("look", arg);
  const fields = await Articls.find(arg);
  console.log(fields);
  const result = fields.map(({ id, [field]: value }) => ({ id, title: value }));

  // output
  //slugs = prepareForTypeahead(slugs);
  return Promise.resolve(result);
};

const getCategorySlugs = async (q) => {
  const slugs = await Categories.find(
    { slug: { $regex: `^${q}`, $options: "i" } },
    { slug: 1 }
  );

  const result = slugs.map(({ id, slug }) => ({ id, title: slug }));

  // output
  //slugs = prepareForTypeahead(slugs);
  return Promise.resolve(result);
};
/**
 * Get articl by id
 * @param {ObjectId} id
 * @returns {Promise<Articl>}
 */
const getArticlById = async (id) => {
  return Articl.findById(id);
};

const getArticlsBySlug = async (slug) => {
  return Articl.find({ categorySlug: slug });
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
  getArticlFields,
  getArticlById,
  updateArticlById,
  deleteArticlById,
};
