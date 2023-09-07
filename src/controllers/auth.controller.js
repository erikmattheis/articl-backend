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
  console.log(`username: ${username}, password: ${password}`)
  const user = await authService.loginUserWithUsernameAndPassword(username, password);

  if (!user) {
    console.log("sending error")
    res.send({ error: "Invalid username or password" });
    return;
  }
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

const forgotUsername = catchAsync(async (req, res) => {
  const result = await authService.getUsernamesFromEmail(req.body.email);
  emailService.sendForgotUsernameEmail(req.body.email, result);
  res.send(result);
});

const sendChangePasswordEmail = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendChangePasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const changePasswordEmail = catchAsync(async (req, res) => {
  await authService.changePasswordEmail(req.body.token, req.body.password, req.body.password2);
  res.status(httpStatus.NO_CONTENT).send();
});

const changePasswordLoggedIn = catchAsync(async (req, res) => {
  await authService.changePasswordLoggedIn(req.body.token, req.body.oldPassword, req.body.password, req.body.password2);
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
  changePasswordLoggedIn,
  sendChangePasswordEmail,
  changePasswordEmail,
  forgotUsername,
  getEmailFromResetPassword,
  sendVerificationEmail,
  verifyEmail,
};
