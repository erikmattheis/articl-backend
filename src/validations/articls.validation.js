const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createArticl = {
  body: Joi.object().keys({
    articlUrl: Joi.string(),
    author: Joi.string(),
    category: Joi.string(),
    categorySlug: Joi.string().required(),
    order: Joi.number(),
    oldId: Joi.string(),
    status: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    abstract: Joi.string(),
    authors: Joi.string(),
    affiliation: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    dateEnd: Joi.date(),
    dateStart: Joi.date(),
    description: Joi.string(),
    fullText: Joi.string(),
    type: Joi.string(),
    year: Joi.number(),
    thumbnailImage: Joi.string().uri(),
    url: Joi.string().uri(),
    venue: Joi.string(),
    imageCaption: Joi.string(),
    imageLocalPath: Joi.string(),
    imageOriginalUrl: Joi.string().uri(),
    imageRemotePath: Joi.string(),
    institution: Joi.string(),
    journal: Joi.string(),
    month: Joi.string(),
    resourceType: Joi.string(),
    reviewSource: Joi.string(),
    reviewUrl: Joi.string().uri(),
    shortTitle: Joi.string(),
    source: Joi.string(),
    sourceId: Joi.string(),
    sourceIdType: Joi.string(),
    startDate: Joi.date(),
    state: Joi.string(),
  }),
};

const getArticls = {
  body: Joi.object().keys({
    categorySlug: Joi.string().required(),
  }),
};

const getArticl = {
  params: Joi.object().keys({
    articlId: Joi.string().custom(objectId),
  }),
};

const updateArticl = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
};

const deleteArticl = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createArticl,
  getArticls,
  getArticl,
  updateArticl,
  deleteArticl,
};
