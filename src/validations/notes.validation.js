const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createNote = {
  body: Joi.object().keys({
    slug: Joi.string().required(),
    oldCategory: Joi.string(),
    oldId: Joi.string(),
    fullText: Joi.string().required(),
    author: Joi.object().keys({ nameFirst: Joi.string(), nameLast: Joi.string(), id: Joi.string().custom(objectId) })
  }),
};

const getNotes = {
  body: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const getNote = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateNote = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
};

const deleteNote = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
