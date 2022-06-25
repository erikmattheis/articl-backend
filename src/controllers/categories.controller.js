/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const pick = require("../utils/pick");
// const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");
const { articlsService, categoriesService, importService, notesService } = require("../services");

const importCategories = catchAsync(async (req, res) => {
  const result = await importService.importCategories();
  res.status(httpStatus.CREATED).send(result);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoriesService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const getCategoryPage = catchAsync(async (req, res) => {
  const category = await categoriesService.getCategoryBySlug(req.query.slug);
  const categories = await categoriesService.getCategoriesByParentSlug(
    req.query.slug
  );
  res.send({ category, categories });
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["title", "slug", "description"]);
  const result = await categoriesService.queryCategories(filter);
  res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoriesService.getCategoryById(req.params.id);
  res.send(category);
});

const getCategorySlugs = catchAsync(async (req, res) => {
  const slugs = await categoriesService.getCategorySlugs(req.query.q);
  res.send(slugs);
});

const updateCategoriesOrder = catchAsync(async (req, res) => {
  const result = await categoriesService.updateCategoriesOrder(req.body.order);
  res.send(result);
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await categoriesService.updateCategoryById(
    req.params.id,
    req.body
  );

  if (req.body.slug !== req.body.oldSlug) {
    await categoriesService.updateParentSlugs(
      req.body.slug,
      req.body.oldSlug
    );
    await articlsService.updateSlugs(
      req.body.slug,
      req.body.oldSlug
    );  
    await notesService.updateSlugs(
      req.body.slug,
      req.body.oldSlug
    );  
  }
  res.send({result});
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoriesService.deleteUserById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send(result);
});

module.exports = {
  importCategories,
  createCategory,
  getCategoryPage,
  getCategorySlugs,
  getCategories,
  getCategory,
  updateCategoriesOrder,
  updateCategory,
  deleteCategory,
};
