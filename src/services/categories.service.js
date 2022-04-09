const httpStatus = require('http-status');
const { Categories } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a category
 * @param {Object} categoriesBody
 * @returns {Promise<Categories>}
 */
const createCategory = async (categoriesBody) => {
  if (await Categories.isCategorySlug(categoriesBody.slug)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Slug "${categoriesBody.slug}" already exists.`);
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
const queryCategories = async (filter, options) => {
  const categories = await Categories.find(filter, options);
  return categories;
};

const getCategoriesByparentSlug = async (parentSlug) => {
  const filter = { parentSlug };

  const categories = await queryCategories(filter, {});
  return categories;
};

/**
 * Get category by slug
 * @param {ObjectId} slug
 * @returns {Promise<Categories>}
 */
const getCategoryBySlug = async (val) => {
  return Categories.find({ slug: { $eq: val } });
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Categories>}
 */
const getCategoryById = async (id) => {
  return Categories.findById(id);
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Categories not found');
  }
  if (updateBody.slug && (await Categories.isCategorySlug(updateBody.slug))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug already taken');
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
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Categories not found');
  }
  await category.remove();
  return category;
};

module.exports = {
  createCategory,
  getCategoriesByparentSlug,
  getCategoryBySlug,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
