const httpStatus = require("http-status");
const axios = require('axios');
const fs = require("fs");
const path = require("path");
const { Categories } = require("../models");
const categoriesService = require("./categories.service");
const ApiError = require("../utils/ApiError");
const SLUG_ERROR_FILE = "../category-errors.json";
const CATEGORIES_JSON_FILE = "../models/categories.json";
const articlsService = require("./articls.service");
const existingSlugs = [];
const Articls = require("../models/articls.model");

const axiosThrottle = require('axios-request-throttle');
axiosThrottle.use(axios, { requestsPerSecond: 1 });

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

      const slug = category.slug;

      const slugExists = await Categories.isCategorySlug(slug);

      if (!slugExists || slug === 0 || slug === "0") {
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
    const num = await Categories.updateMany(
      { oldParentId: category.oldId },
      { parentSlug: slug }
    );
  }

  let result = await Categories.find();
  return result;
};

const importArticlsByChr = async (chr) => {
  let n = 0;

    let categories = await getCategoriesFromExportedJSON();
    categories = categories.filter(cat => cat.html_title.charAt(0).toLowerCase() === chr.toLowerCase());

    categories.forEach(async (category) => {
      let articls = await getArticls(category.slug);
      console.log('article',articls)
      if (articls.length) {
        n = n + articls.length;
        let result = await Articls.bulkWrite(articls.map(doc => ({

          updateOne: {
            filter: { oldId: doc.ID },
            update: doc,
            upsert: true,
          }
  
        })));
      }
    });
    return n;
  }

  


/*

axios.get('https://jsonplaceholder.typicode.com/users')
  .then(res => {
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.status);
    console.log('Date in Response header:', headerDate);

    const users = res.data;

    for(user of users) {
      console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    }
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
  */
const getArticls = async (slug) => {

  const articls = await axios.get(`https://articl.net/wp-json/articl/v1/articl_get_articls?category=${slug}`);

  return articls.data;

}

const importCategories = async () => {
  const start = new Date();
  try {
    let categories = await getCategoriesFromExportedJSON();
    categories = await loopThroughOldAndCreateNew(categories, true);
    categories = await Categories.find();
    categories = await loopThroughAndChangeParentSlug(categories);
    let articls = await articlsService.getArticlsBySlug(categories[0].slug);
    console.log('articls', articls);
    console.log('categories', categories[0])
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  importCategories,
  importArticlsByChr
};
