/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoriesService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoriesService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const getCategoryPage = catchAsync(async (req, res) => {
  const result = await categoriesService.getCategoryBySlug(req.query.slug);
  res.send(result);
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'slug', 'description']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoriesService.queryCategories(filter, options);
  res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
  const category = categoriesService.getCategoryById(req.query.id);
  res.send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const user = await categoriesService.updateCategoryById(req.params.id, req.body);
  res.send(user);
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoriesService.deleteUserById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send(result);
});

module.exports = {
  createCategory,
  getCategoryPage,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};