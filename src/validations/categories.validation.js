const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const getAISummary = {
  body: Joi.object().keys({
    text: Joi.string().required(),
  }),
};

const upsertCategory = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    parentSlug: Joi.string().required(),
    description: Joi.string(),
    AISummary: Joi.string(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    title: Joi.string(),
    slug: Joi.string(),
    parentSlug: Joi.string(),
    description: Joi.string(),
    AISummary: Joi.string(),
  }),
};

const getCategoryPage = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getCategorySlugs = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

const getSlugAncestry  = {
  query: Joi.object().keys({
    slug: Joi.string().required(),
  }),
}

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      slug: Joi.string().required(),
      parentSlug: Joi.string().required(),
      oldSlug: Joi.string().optional(),
      description: Joi.string().allow(null,''),
      AISummary: Joi.string().allow(null,''),
    })
    .min(1),
};

const updateCategoriesOrder = {
  body: Joi.object().keys({
    order: Joi.array()
      .min(1)
      .items({
        id: Joi.string().custom(objectId),
        order: Joi.number().required(),
      }),
  }),
};

const deleteCategory = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  getAISummary,
  upsertCategory,
  getCategories,
  getCategoryPage,
  getCategorySlugs,
  getSlugAncestry,
  getCategory,
  updateCategory,
  updateCategoriesOrder,
  deleteCategory,
};
