const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    institution: Joi.string(),
    education: Joi.string(),
    nameFirst: Joi.string(),
    nameLast: Joi.string(),
    theme: Joi.string(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    nameFirst: Joi.string(),
    nameLast: Joi.string(),
    role: Joi.string(),
    institution: Joi.string(),
    education: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      institution: Joi.string().allow(null, ""),
      education: Joi.string().allow(null, ""),
      nameFirst: Joi.string().allow(null, ""),
      nameLast: Joi.string().allow(null, ""),
      theme: Joi.string().allow(null, ""),
    })
    .min(1),
};

const updateMe = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      institution: Joi.string().allow(null, ""),
      education: Joi.string().allow(null, ""),
      nameFirst: Joi.string().allow(null, ""),
      nameLast: Joi.string().allow(null, ""),
      theme: Joi.string().allow(null, ""),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
