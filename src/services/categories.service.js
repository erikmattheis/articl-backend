const httpStatus = require("http-status");
const { Categories } = require("../models");
const ApiError = require("../utils/ApiError");
const regexEscape = require("regex-escape");

/**
 * Create a category
 * @param {Object} categoriesBody
 * @returns {Promise<Categories>}
 */
const upsertCategory = async (req, userId) => {
  const categoriesBody = req.body;

  // Check if slug already exists if it is a new category and therefore the request method is POST
  if (req.method === "POST" && (await Categories.isCategorySlug(categoriesBody.slug))) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Slug "${categoriesBody.slug}" already exists.`);
  }

  if (categoriesBody.id) {
    const category = await getCategoryById(categoriesBody.id);

    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    if (categoriesBody.id !== userId) {
      // throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to update this note.");
    }
  }
  return Categories.updateOne({ slug: categoriesBody.slug }, categoriesBody, { upsert: true });
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
  const categories = await Categories.find(filter).sort([["order", 1]]);
  return categories;
};

function makeCategoriesOptions(options) {
  options.sortBy = options.sortBy ? options.sortBy : "order:asc";
  options.limit = options.limit ? Number(options.limit) : 10;
  options.page = options.page ? Number(options.page) : 1;

  return options;
}

const getCategoriesByParentSlug = async (parentSlug, user) => {
  const filter = { parentSlug };
  const options = makeCategoriesOptions({});
  // TODO: remove this line
  // await deleteCatsWithoutHTMLTitle();
  const categories = await queryCategories(filter, options, {});
  return categories;
};

const deleteCatsWithoutHTMLTitle = async () => {
  const cats = await Categories.find({ titleHtml: { $exists: false } }).exec();
  for (const cat of cats) {
    await Categories.deleteOne({ _id: cat.id });
  }
};

const updateParentSlugs = async (slug, oldSlug) => {
  const result = await Categories.updateMany(
    { parentSlug: oldSlug },
    { $set: { parentSlug: slug } },
  );
};

const markCategoryArticlsImported = async (slug) => {
  const result = await Categories.updateOne({ slug }, { $set: { wpArticlsImported: true } });
};

/**
 * Get category by slug
 * @param {ObjectId} slug
 * @returns {Promise<Categories>}
 */
const getCategoryBySlug = async (slug) => {
  if (slug === "0" || slug === 0) {
    return [
      {
        title: "Articl.net - Radiology Database",
        titleHtml: "Articl.net - Radiology Database",
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

  return Promise.resolve(result);
};

const getSlugAncestry = async (slug, breadcrumbs = []) => {
  if (!slug) {
    return Promise.reject(new Error(`Slug category ${slug} not found.`));
  }
  const item = await Categories.find(
    { slug },
    { title: 1, titleHtml: 1, slug: 1, parentSlug: 1 },
  ).exec();

  if (!item[0]) {
    return Promise.resolve(breadcrumbs.reverse());
  } else {
    breadcrumbs.push(item[0]);
    return getSlugAncestry(item[0].parentSlug, breadcrumbs);
  }
};

const getBreadcrumbs = async (slug) => {
  const result = await getSlugAncestry(slug, []);
  return result || [];
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
const updateCategoryById = async (categoryId, updateBody, userId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }
  if (updateBody.slug && (await Categories.isCategorySlug(updateBody.slug, categoryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Slug already taken");
  }
  if (category.user?.id !== userId) {
    //throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to update this category.");
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
const deleteCategoryById = async (id, user) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, `Category ${id} not found`);
  }
  if (user.role !== "superadmin") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      `You don't have permission to delete this category. ${user.role} and ${category.user?.id}`,
    );
  }
  /* TODO check if user owns all descendents and articls and questions and */
  await category.deleteOne({ id });
  return category;
};

module.exports = {
  upsertCategory,
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
  markCategoryArticlsImported,
};
