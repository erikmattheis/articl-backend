const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createQuestion = {
  body: Joi.object().keys({
    answers: Joi.array()
      .items({
        answer: Joi.string().required(),
        correct: Joi.boolean().required(),
        explanation: Joi.string(),
        order: Joi.intiger(),
      })
      .min(2),
    question: Joi.string().required(),
    categorySlug: Joi.string().required(),
    author: Joi.string(),
    order: Joi.intiger(),
  }),
};

const getQuestions = {
  query: Joi.object().keys({
    question: Joi.string(),
    categorySlug: Joi.string(),
    author: Joi.string(),
    answer: Joi.string(),
    explanation: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuestion = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    answers: Joi.array().items({
      answer: Joi.string().required(),
      correct: Joi.boolean().required(),
      explanation: Joi.string(),
      order: Joi.intiger(),
    }),
    question: Joi.string().required(),
    categorySlug: Joi.string().required(),
    author: Joi.string(),
    order: Joi.intiger(),
  }),
};

const updateMe = {
  body: Joi.object().keys({
    answers: Joi.array()
      .items({
        answer: Joi.string().required(),
        correct: Joi.boolean().required(),
        explanation: Joi.string(),
        order: Joi.intiger(),
      })
      .min(2),
    question: Joi.string().required(),
    categorySlug: Joi.string().required(),
    author: Joi.string(),
    order: Joi.intiger(),
  }),
};

const deleteQuestion = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
