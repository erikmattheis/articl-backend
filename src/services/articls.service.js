const httpStatus = require("http-status");
const regexEscape = require("regex-escape");
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

const defaultProjection = {
  author: 2,
  slug: 9,
  title: 5,
  htmlTitle: 10,
  abstract: 7,
  authors: 5,
  description: 9,
  url: 1,
  imageCaption: 10,
  institution: 5,
  journal: 5,
}

const searchByWeight = async (searchText, searchFields, projection = defaultProjection) => {

  const searchFieldsArray = searchFields.split(',');

  try {
    const searchQuery = {
      $text:
      {
        $search: searchText
      }
    };


    const articls = await Articls.find(
      searchQuery,
        projection,
        { sort: { score: { $meta: 'textScore' } } }
      );

    return articls;

  } catch (err) {
    console.error('err', err);
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
  const articls = await Articls.find({ slug: slug });
  return articls.sort(sortArticls);
};

/*
const orderArray = ['Review (OA)', 'Review (PA)', 'Research (OA)', 'Research (PA)', 'Web', 'Images', 'Videos'];

const sortArticls = (a, b) => {
  const aIndex = orderArray.indexOf(a.type);
  const bIndex = orderArray.indexOf(b.type);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }

  return a.order - b.order;
}

without the ording:

articls = [{
  order:2,
  title: 'Images title 2',
  type:'Images',
},
{
  order:1,
  title: 'Images title 1',
  type:'Images',
},
{
  order:2,
  title: 'Web title 2',
  type:'Web',
},
{
  order:1,
  title: 'Web title 1',
  type:'Web',
}]

Ordered:

[{
order:1,
title: 'Web title 1',
type:'Web',
},
{
  order:2,
  title: 'Web title 2',
  type:'Web',
},
{
  order:1,
  title: 'Images title 1',
  type:'Images',
},
{
  order:2,
  title: 'Images title 2',
  type:'Images',
}]

const getArticlsBySlug = async (slug) => {
  return Articls.find({ slug: slug }).sort(sortArticls);
};


  I have an array of articles. Each article is this object:
  article: {
    order,
    title
    type,
  }

  The type is one of the orderArray - ['Review (OA)', 'Review (PA)', 'Research (OA)', 'Research (PA)', 'Web', 'Images', 'Videos']

  I wish to order the results first by their "type" in the order the appear in orderArray and then by their "order" property.

  I am using Mongoose. I can use lodash if needed.

  How can I accompliush this? So far, I have:

  return Articls.find({ slug: slug }).sort([['order', 1]]);

  */

/**
 * Update articl by id
 * @param {ObjectId} articlId
 * @param {Object} updateBody
 * @returns {Promise<Articl>}
 */
const updateArticlById = async (articlId, updateBody, userId) => {
  const articl = await getArticlById(articlId);
  if (!articl) {
    throw new ApiError(httpStatus.NOT_FOUND, "Articl not found");
  }

  if (articl.user?.id !== userId) {
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
const deleteArticlById = async (id, userId) => {
  const articl = await getArticlById(id);
  if (!articl) {
    throw new ApiError(httpStatus.NOT_FOUND, "Articl not found");
  }
  if (articl.user?.id !== userId) {
    //throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to delete this articl.");
  }
  await articl.remove();
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
