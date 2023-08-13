const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    username: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const forgotUsername = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const sendChangePasswordEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email()
  }),
};

const sendVerificationEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const changePasswordEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email()
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  forgotUsername,
  sendChangePasswordEmail,
  verifyEmail,
};
