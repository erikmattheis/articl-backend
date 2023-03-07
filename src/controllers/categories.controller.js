/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const pick = require("../utils/pick");
// const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");
const { articlsService, categoriesService, importsService, notesService, aiService } = require("../services");

const getAISummary = catchAsync(async (req, res) => {
  console.log('in controller', req.query.text)
  const result = await aiService.getAISummary(req.query.text);
  res.send(result);
});

const importCategories = catchAsync(async (req, res) => {
  const result = await importsService.importCategories();
  res.status(httpStatus.CREATED).send(result);
});

const importCategoriesByChr = catchAsync(async (req, res) => {
  const result = await importsService.importCategories(req.params.chr);
  res.status(httpStatus.CREATED).send(result);
});

const upsertCategory = catchAsync(async (req, res) => {
  console.log(req.user.id, req.body.user.id)
  const category = await categoriesService.upsertCategory(req.body, req.user.id);
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
    req.body,
    req.user.id
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
    /* todo: update slugs in q and a */
  }
  res.send({ result });
});

const deleteCategory = catchAsync(async (req, res) => {
  console.log('controller', req.body.id, req.user.id)
  const result = await categoriesService.deleteCategoryById(req.body.id, req.user.id);
  res.status(httpStatus.NO_CONTENT).send(result);
});

module.exports = {
  getAISummary,
  importCategories,
  upsertCategory,
  getCategoryPage,
  getCategorySlugs,
  getCategories,
  getCategory,
  updateCategoriesOrder,
  updateCategory,
  deleteCategory,
};
