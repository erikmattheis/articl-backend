const httpStatus = require("http-status");
const regexEscape = require("regex-escape");
const groupBy = require("lodash/groupBy");
const Articls = require('../models/articls.model');
const ApiError = require("../utils/ApiError");

/**
 * Create a articl
 * @param {Object} articlBody
 * @returns {Promise<Articl>}
 */
const createArticl = async (articlBody, user) => {
  articlBody.user = user.id;
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
const queryArticls = async (filter, options, projection) => {
  return Articls.paginate(filter, options, projection);
};

/**
 * Get articl by id
 * @param {ObjectId} id
 * @returns {Promise<Articl>}
 */
const getArticlById = async (id) => {
  return Articls.findById(id);
};

const getArticlCount = async (id) => {
  return Articls.countDocuments();
};

const updateSlugs = async (slug, oldSlug) => {
  return Articls.updateMany({ slug: oldSlug }, { $set: { slug: slug } });
};

const getAnyArticlFieldValue = async (field, value) => {
  const regex = new RegExp(regexEscape(value), "i");
  const arg = { [field]: { $regex: regex } };
  const result = await Articls.distinct(field, arg);
  return Promise.resolve(result);
};

const defaultProjection = [
  'author',
  'slug',
  'title',
  'titleHtml',
  'abstract',
  'authors',
  'url',
  'institution',
  'journal',
  'type',
];

const searchByWeight = async (searchText, searchFields, projection = defaultProjection) => {
  try {
    const searchQuery = {
      $text: {
        $search: searchText
      }
    };

    if (Array.isArray(searchFields) && searchFields.length > 0) {
      const fieldQuery = searchFields.map(field => ({ [field]: { $exists: true } }));
      searchQuery.$and = fieldQuery;
    }

    const projectionObject = projection || {};

    const articls = await Articls.find(
      searchQuery,
      projectionObject,
      { sort: { score: { $meta: 'textScore' } } }
    );
    return articls;

  } catch (err) {

    throw err;
  }

};

const orderArray = [
  "Review (OA)",
  "Review (PA)",
  "Research (OA)",
  "Research (PA)",
  "Web",
  "Images",
  "Videos",
  "Presentations",
  "Podcast",
];

const sortArticls = (a, b) => {
  const aIndex = orderArray.indexOf(a.type);
  const bIndex = orderArray.indexOf(b.type);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }

  return a.order - b.order;
};

const getArticlsBySlug = async (slug) => {
  const articls = await Articls.find({ slug });

  console.log(articls[0]?.id);
  articls.sort(sortArticls);
  console.log(articls[0]?.id);
  console.log('')
  grouped = groupBy(articls, (articl) => articl?.type)
  return Object.entries(grouped);
;
};

/**
 * Update articl by id
 * @param {ObjectId} articlId
 * @param {Object} updateBody
 * @returns {Promise<Articl>}
 */
const updateArticlById = async (articlId, updateBody, sessionUser) => {
  const articl = await getArticlById(articlId);
  if (!articl) {
    throw new ApiError(httpStatus.NOT_FOUND, "Articl not found");
  }

  if (articl.user?.id !== sessionUser.id && sessionUser.role !== "superadmin") {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to edit this articl.");
  }
  Object.assign(articl, updateBody);
  await articl.save();
  return articl;
};

const updateArticlsOrder = async function (arr) {
  let result;
  for (const { id, order } of arr) {
    result = await Articls.findByIdAndUpdate(id, { $set: { order } }).exec();
  }
  return true;
};

/**
 * Delete articl by id
 * @param {ObjectId} id
 * @returns {Promise<Articl>}
 */
const deleteArticlById = async (id, user) => {
  const articl = await getArticlById(id);
  if (!articl) {
    throw new ApiError(httpStatus.NOT_FOUND, "Articl not found");
  }
  if (articl.user?.id !== user.id && sessionUser.role !== "superadmin") {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to delete this articl.");
  }
  await articl.deleteOne({ id });
  return articl;
};

module.exports = {
  createArticl,
  queryArticls,
  searchByWeight,
  getArticlCount,
  updateSlugs,
  getAnyArticlFieldValue,
  getArticlById,
  getArticlsBySlug,
  updateArticlById,
  updateArticlsOrder,
  deleteArticlById,
};
