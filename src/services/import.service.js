const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");
const { Categories } = require("../models");
const categoriesService = require("./categories.service");
const ApiError = require("../utils/ApiError");

const SLUG_ERROR_FILE = "../category-errors.json";
const CATEGORIES_JSON_FILE = "../models/categories.json";
const existingSlugs = [];

const slugify = (slug) => {
  let str = slug.replace(/\s/g, "-");
  str = str.toLowerCase();
  str = str.length ? str : 0;
  return encodeURIComponent(str);
};

const toSlug = (slug, name) => {
  try {
    if (slug) {
      return slugify(slug);
    }
    if (!slug && name) {
      return slugify(name);
    }
    if (!slug) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Could not convert to suitable slug."
      );
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + "7");
  }
};

const wpCategoryToNodeCategory = (old) => {
  try {
    const newObj = {
      oldId: Number(old.term_id),
      title: old.name,
      titleHtml: old.html_title ? old.html_title : "",
      slug: toSlug(old.slug, old.name),
      description: old.description ? old.description : "",
      oldParentId: Number(old.parent) ? Number(old.parent) : 0,
      parentSlug: "0",
      image: old.category_image ? old.category_image : "",
      order: old.term_order ? Number(old.term_order) : 0,
    };
    return newObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + "6");
  }
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getCategoryById = async (id) => {
  try {
    return Category.findById(id);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + "5");
  }
};

/**
 * Get a category
 * @returns {Promise<Categories>}
 */
const getCategoriesFromExportedJSON = async () => {
  try {
    const rawData = fs.readFileSync(
      path.resolve(__dirname, CATEGORIES_JSON_FILE)
    );
    let data = JSON.parse(rawData);
    return data.categories;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + " 44    sx");
  }
};

const loopThroughOldAndCreateNew = async (categories, reallySave = false) => {
  try {
    for (let n = 0, i = 0; i < categories.length; i += 1) {
      const category = wpCategoryToNodeCategory(categories[i]);

      const categorySlug = category.slug;

      const slugExists = await Categories.isCategorySlug(categorySlug);

      if (!slugExists || categorySlug === 0 || categorySlug === "0") {
        if (reallySave) {
          await categoriesService.createCategory(category);
          n += 1;
        }
      } else {
        existingSlugs.push(categories[i]);
      }
    }
    const result = await Categories.find();
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + "3");
  }
};

const oldIdToParentSlug = async (oldParentId) => {
  try {
    const id = oldParentId ? oldParentId : 0;
    const parent = await categoriesService.getCurrentCategorySlugByOldId(id);
    if (parent.slug) {
      return parent.slug;
    }
    return parent.title;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + " 22 ");
  }
};

const loopThroughAndChangeParentSlug = async (categories) => {
  for (const category of categories) {
    const slug = await categoriesService.getCurrentCategorySlugByOldId(
      category.oldId
    );
    console.log("oldId", category.oldId);
    console.log("slug", slug);
    const num = await Categories.updateMany(
      { oldParentId: category.oldId },
      { parentSlug: slug }
    );
    console.log("num", num);
  }

  let result = await Categories.find();
  return result;
};

const importCategories = async () => {
  const start = new Date();
  try {
    let categories = await getCategoriesFromExportedJSON();
    categories = await loopThroughOldAndCreateNew(categories, true);
    categories = await Categories.find();
    console.log("categories", categories.length);
    categories = await loopThroughAndChangeParentSlug(categories);
    const updateNum = categories.length;

    const stop = new Date();

    const time = (stop - start) / 1000;

    if (existingSlugs.length) {
      fs.writeFileSync(SLUG_ERROR_FILE, JSON.stringify(existingSlugs));
    }

    return {
      updateNum,
      time,
    };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error + " ccc ");
  }
};

module.exports = {
  importCategories,
};
