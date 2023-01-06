const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const getUsers = {
  query: Joi.object().keys({
    nameFirst: Joi.string(),
    nameLast: Joi.string(),
    role: Joi.string(),
    education: Joi.string(),
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

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    nameFirst: Joi.string().required(),
    nameLast: Joi.string().required(),
    position: Joi.string().required(),
    education: Joi.string(),
    institution: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    nation: Joi.string().required(),
    theme: Joi.string(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      nameFirst: Joi.string().required(),
      nameLast: Joi.string().required(),
      position: Joi.string().required(),
      education: Joi.string(),
      institution: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      nation: Joi.string().required(),
      theme: Joi.string(),
      theme: Joi.string().allow(null, ""),
    })
    .min(1),
};

const updateMe = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      nameFirst: Joi.string().required(),
      nameLast: Joi.string().required(),
      position: Joi.string().required(),
      education: Joi.string(),
      institution: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      nation: Joi.string().required(),
      theme: Joi.string(),
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
