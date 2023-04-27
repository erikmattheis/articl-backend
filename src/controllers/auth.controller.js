const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService, emailService } = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(req.body.email, token);
  res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const result = await authService.logout(req.body.accessToken);
  res.send(result);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const forgotUsername = catchAsync(async (req, res) => {
  const result = await authService.getUsernamesFromEmail(req.body.email);
  emailService.sendForgotUsernameEmail(req.body.email, result);
  res.send(result);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const getEmailFromResetPassword = catchAsync(async (req, res) => {
  const result = await authService.getEmailFromResetPassword(req.query.token);
  res.send(result);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user.id);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.query.token);
  await emailService.sendWelcomeEmail(user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  forgotUsername,
  resetPassword,
  getEmailFromResetPassword,
  sendVerificationEmail,
  verifyEmail,
};
