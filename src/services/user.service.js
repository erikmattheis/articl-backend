const httpStatus = require("http-status");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  if (await User.isUsernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByUsername = async (username) => {
  return User.findOne({ 'username': username });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUsersByEmail = async (email) => {
  return User.find({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, req) => {
  console.log('req.user', req);
  let user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (userId !== req.user?._id.toString() && req.user?.role !== "superadmin") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized to update this user");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }

  user = await User.findByIdAndUpdate(userId, updateBody);
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updatePasswordById = async (userId, updateBody) => {
  let user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};


/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, user) => {
  if (userId !== user._id && user.role !== "superadmin") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized to delete this user");
  }
  await user.deleteOne({ id: userId });
  return user;
};

const isPasswordMatch = async (password) => { 
  const match = await User.methods.isPasswordMatch(password);
  return match;
};


module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByUsername,
  getUsersByEmail,
  updateUserById,
  updatePasswordById,
  deleteUserById,
  isPasswordMatch,
};
