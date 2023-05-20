const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect username or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} accessToken
 * @returns {Promise}
 */


const logout = async (accessToken) => {
  const accessTokenDoc = await Token.findOne({
    token: accessToken,
    type: tokenTypes.ACCESS,
  });

  if (!accessTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not found");
  }
  
  console.log("accessTokenDoc before remove:", accessTokenDoc);
  console.log("accessTokenDoc instanceof Token:", accessTokenDoc instanceof Token);

  if (!(accessTokenDoc instanceof Token)) {
    throw new Error("Invalid access token document");
  }

  const removedAccessToken = await accessTokenDoc.deleteOne({token: accessToken,type: tokenTypes.ACCESS});

  console.log("removedAccessToken:", removedAccessToken);

  return removedAccessToken;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error("Token did not match user.");
    }
    await refreshTokenDoc.remove();
    const result = await tokenService.generateAuthTokens(user);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (token, password) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      token,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user._id);
    const userId = user._id;
    await userService.updatePasswordById(userId, { password });
    await Token.deleteMany({ user: userId, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

const getUserRights = async (token, password) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      token,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user._id);
    const userId = user._id;
    await userService.updatePasswordById(userId, { password });
    await Token.deleteMany({ user: userId, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

const getEmailFromResetPassword = async (resetPasswordToken) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error("User not found.");
    }
    return User.findById(id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

const getUsernamesFromEmail = async (email) => {
  try {
    const usernames = await userService.getUsersByEmail(email);
    return usernames;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error("no user");
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

module.exports = {
  loginUserWithUsernameAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  getEmailFromResetPassword,
  getUsernamesFromEmail,
  verifyEmail,
};
