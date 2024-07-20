const fs = require("fs");
const httpStatus = require("http-status");
const moment = require("moment");
const axios = require("axios");
const regexEscape = require("regex-escape");
const Articls = require('../models/articls.model');
const ArticlsWPImported = require('../models/articls.wpPost.model');
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

const createArticls = async (articlBodies, user) => {
  articlBodies.user = user.id;
  return Articls.insertMany(articlBody);
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
  'articlType',
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
  const aIndex = orderArray.indexOf(a.articlType);
  const bIndex = orderArray.indexOf(b.articlType);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }

  return a.order - b.order;
};

const getArticlsBySlug = async (slug) => {
  const articls = await Articls.find({ slug }, '-wpPost');
  return articls;
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
console.log('sessionUser', sessionUser, articl.user?.id, sessionUser.id, sessionUser.role)
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
  if (articl.user?.id !== user.id && user.role !== "superadmin") {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to delete this articl.");
  }
  await articl.deleteOne({ id });
  return articl;
};

const PER_PAGE = 100;

const getBatchOfPosts = async (page, per_page = PER_PAGE) => {
  const posts = await axios.get(`https://articl.net/wp-json/wp/v2/directory_link?per_page=${per_page}&page=${page}`);
  console.log('posts', posts.data.length);
  return posts.data;
}

const toAuthorsArray = (authors) => {
  if (authors) {
    return authors.split(',').map((author) => author.trim());
  }
  return [];
};

const wpPostToMongoDoc = (wpPost) => {

  const mongoDoc = {};

  mongoDoc.authors = toAuthorsArray(wpPost.authors);
  mongoDoc.authorsOrig = wpPost.authors;
  mongoDoc.order = wpPost.term_order;
  mongoDoc.title = wpPost.post_title;
  mongoDoc.slug = wpPost.directory_link_category?.length ? wpPost.directory_link_category[0].slug : 0;
  mongoDoc.articlType = wpPost?.directory_link_resource_type?.length ? wpPost.directory_link_resource_type[0].name : 0;
  //mongoDoc.oldId = wpPost.ID;
  mongoDoc.updatedAt = moment(wpPost.post_date_gmt, 'DD/MM/YYYY HH:mm:ss').toISOString();
  mongoDoc.wpPost = wpPost;
  return mongoDoc;
}

const wpPostToMongoDoc2 = (wpPost) => {

  const mongoDoc = {};

  mongoDoc.authors = toAuthorsArray(wpPost.authors);
  mongoDoc.authorsOrig = wpPost.authors;
  mongoDoc.order = wpPost.term_order;
  mongoDoc.title = wpPost.title.rendered;
  mongoDoc.slug = wpPost.directory_link_category?.length ? wpPost.directory_link_category[0].slug : 0;
  mongoDoc.articlType = wpPost?.directory_link_resource_type?.length ? wpPost.directory_link_resource_type[0].name : 0;
  //mongoDoc.oldId = wpPost.ID;
  mongoDoc.updatedAt = moment(wpPost.post_date_gmt, 'DD/MM/YYYY HH:mm:ss').toISOString();
  mongoDoc.wpPost = wpPost;
  return mongoDoc;
}
const recordCurrentPage = async (page) => {
  console.log('importing page', page);
  fs.writeFileSync('current_page.txt', page + "");
}

// recordCurrentPage(2);

const mostRecentPage = async () => {
  try {
    const page = fs.readFileSync('current_page.txt');
    return page.toString();
  } catch (err) {
    return 1;
  }
}

const recursivelyImportPosts = async (p) => {
  const page = parseInt(p);
  const posts = await getBatchOfPosts(page, PER_PAGE);
  console.log('posts', posts[0])
  if (posts.length) {

    const mongoDocs = posts.map(wpPostToMongoDoc2);
    await Articls.insertMany(mongoDocs);
    await recordCurrentPage(page);

    if (page + 0 > 2) {
      //process.exit(0);
    }
    await recursivelyImportPosts(page + 1);
  }
}

const initBatchImport = async () => {
  const page = await mostRecentPage();
  await recursivelyImportPosts(page);
}

module.exports = {
  createArticl,
  createArticls,
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
  initBatchImport,
};
