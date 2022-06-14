const Joi = require("joi");
const { min } = require("moment");
const { objectId } = require("./custom.validation");

const createArticl = {
  body: Joi.object().keys({
    abstract: Joi.string(),
    affiliation: Joi.string(),
    articlUrl: Joi.string(),
    authors: Joi.string(),
    category: Joi.string(),
    slug: Joi.string().required(),
    city: Joi.string(),
    country: Joi.string(),
    dateEnd: Joi.date(),
    dateStart: Joi.date(),
    description: Joi.string(),
    fullText: Joi.string(),
    imageCaption: Joi.string(),
    imageLocalPath: Joi.string(),
    imageOriginalUrl: Joi.string().uri(),
    imageRemotePath: Joi.string(),
    institution: Joi.string(),
    journal: Joi.string(),
    month: Joi.string(),
    oldId: Joi.string(),
    order: Joi.number(),
    resourceType: Joi.string(),
    reviewSource: Joi.string(),
    reviewUrl: Joi.string().uri(),
    shortTitle: Joi.string(),
    source: Joi.string(),
    sourceId: Joi.string(),
    sourceIdType: Joi.string(),
    startDate: Joi.date(),
    state: Joi.string(),
    status: Joi.string().required(),
    thumbnailImage: Joi.string().uri(),
    title: Joi.string().required(),
    type: Joi.string(),
    type: Joi.string().required(),
    url: Joi.string().uri(),
    venue: Joi.string(),
    year: Joi.number(),
  }),
};

const getArticls = {
  body: Joi.object().keys({
    slug: Joi.string().required(),
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

const updateArticlsOrder = {
  body: Joi.object().keys({
    order: Joi.array()
      .min(1)
      .items({
        id: Joi.string().custom(objectId),
        order: Joi.number().required(),
      }),
  }),
};

const deleteArticl = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createArticl,
  getArticls,
  getArticl,
  updateArticl,
  updateArticlsOrder,
  deleteArticl,
};
