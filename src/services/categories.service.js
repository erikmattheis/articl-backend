const httpStatus = require("http-status");
const { Categories } = require("../models");
const ApiError = require("../utils/ApiError");
const regexEscape = require("regex-escape");

/**
 * Create a category
 * @param {Object} categoriesBody
 * @returns {Promise<Categories>}
 */
const createCategory = async (categoriesBody) => {
  if (await Categories.isCategorySlug(categoriesBody.slug)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Slug "${categoriesBody.slug}" already exists.`
    );
  }
  return Categories.create(categoriesBody);
};

/**
 * Query for categorys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter) => {
  const categories = await Categories.find(filter).sort([['order', 1]]);
  return categories;
};

function makeCategoriesOptions(options) {
  options.sortBy = options.sortBy ? options.sortBy : "order:asc";
  options.limit = options.limit ? Number(options.limit) : 10;
  options.page = options.page ? Number(options.page) : 1;

  return options;
}

const getCategoriesByParentSlug = async (parentSlug) => {
  const filter = { parentSlug };
  const options = makeCategoriesOptions({})
  const categories = await queryCategories(filter, options, {});
  return categories;
};

const updateParentSlugs = async (slug, oldSlug) => {
  const result = await Categories.updateMany({ parentSlug: oldSlug }, { $set: { parentSlug: slug } })
}

/**
 * Get category by slug
 * @param {ObjectId} slug
 * @returns {Promise<Categories>}
 */
const getCategoryBySlug = async (slug) => {
  console.log('wtf here')
  if (slug === "0" || slug === 0) {
    return [
      {
        title: "Articl.net - Radiology Database",
        description:
          "Diagnostic Radiology, Interventional Radiology, Endovascular Surgical Neuroradiology, Nuclear medicine, Ultrasound articles, conferences, journals, societies, books, websites and much more.",
      },
    ];
  }
  const filter = { slug };
  const category = await queryCategories(filter, {});
  return category;
};

const prepareForTypeahead = async (categories) => {
  return categories.map((category) => category.slug);
};

const getCategorySlugs = async (q) => {

  const regex = new RegExp(regexEscape(`${q}`), "i");

  const slugs = await Categories.find({ slug: { $regex: regex } }, { slug: 1 });

  const result = slugs.map(({ id, slug }) => slug);

  // output
  //slugs = prepareForTypeahead(slugs);
  return Promise.resolve(result);
};

const getSlugAncestry = async (slug, breadcrumbs) => {
  console.log('slug is', slug);
  console.log('breadcrumbs is', breadcrumbs);
  if (!slug) {
    return Promise.reject(new Error(`Slug category ${slug} not found.`))
  }
  const item = await Categories.find({ slug }, { title: 1, slug: 1, parentSlug: 1 }).exec();
  console.log('found', item[0]);

  if (!item[0] || item[0]?.parentSlug + "" === "0") {
    breadcrumbs.push(item[0]);
    console.log('returning breadcrumbs', breadcrumbs)
    return Promise.resolve(breadcrumbs.reverse());
  }
  else {
    breadcrumbs.push(item[0]);
    console.log('not zero', item[0]?.title, item?.parentSlug)
    console.log('getting', item[0].parentSlug, "parent")
    return getSlugAncestry(item[0].parentSlug, breadcrumbs);

  }
}

const getBreadcrumbs = async (slug) => {
  const result = await getSlugAncestry(slug, [])
  console.log('found', result);
  return result;
}


/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Categories>}
 */
const getCategoryById = async (id) => {
  return Categories.findById(id);
};

/**
 * Get category by id
 * @param {Number} id
 * @returns {Promise<Categories>}
 */
const getCurrentCategorySlugByOldId = async (id) => {
  try {
    const result = await Categories.findOne({ oldId: id });
    return result?.slug;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + " yy ");
  }
};

const updateCategoriesOrder = async function (arr) {
  let result;
  for (const { id, order } of arr) {
    result = await Categories.findByIdAndUpdate(id, { $set: { order } }).exec();
  }
  return true;
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Categories>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }
  if (updateBody.slug && (await Categories.isCategorySlug(updateBody.slug, categoryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Slug already taken");
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Categories>}
 */
const deleteCategoryById = async (id) => {
  console.log('id', id);
  const category = await getCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, `Category ${id} not found`);
  }
  await category.remove();
  return category;
};

module.exports = {
  createCategory,
  getCategoriesByParentSlug,
  getCategoryBySlug,
  getCategorySlugs,
  getBreadcrumbs,
  queryCategories,
  getCategoryById,
  updateCategoriesOrder,
  updateParentSlugs,
  getCurrentCategorySlugByOldId,
  updateCategoryById,
  deleteCategoryById,
};
