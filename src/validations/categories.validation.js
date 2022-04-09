const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    parentSlug: Joi.string().required().custom(password),
    description: Joi.string(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    title: Joi.string(),
    slug: Joi.string(),
    parentSlug: Joi.string(),
    description: Joi.string(),
  }),
};

const getCategoryPage = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const updateCategory = {
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      slug: Joi.string().required(),
      parentSlug: Joi.string().required().custom(password),
      description: Joi.string(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryPage,
  getCategory,
  updateCategory,
  deleteCategory,
};
