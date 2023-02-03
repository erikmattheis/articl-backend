/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const passport = require("passport");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["nameLast", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getMe = catchAsync(async (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.send(req.user);
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
  deleteUser,
};
