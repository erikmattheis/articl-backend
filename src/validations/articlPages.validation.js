const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getCategoryPage = {
  params: Joi.object().keys({
    slug: Joi.string(),
  }),
};

module.exports = {
  getCategoryPage,
};
