/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");
const { categoriesService, articlsService, notesService } = require("../services");

const getHomePage = catchAsync(async (req, res) => {
  const category = await categoriesService.getCategoryBySlug("0");
  const categories = await categoriesService.getCategoriesByParentSlug("0");
  res.send({ category, categories });
});

const getArticlPage = catchAsync(async (req, res) => {
  const breadcrumbs = await categoriesService.getBreadcrumbs(req.params.slug);
  const category = await categoriesService.getCategoryBySlug(req.params.slug);
  if (Object.keys(category).length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
  }
  const categories = await categoriesService.getCategoriesByParentSlug(
    req.params.slug
  );
  const articls = await articlsService.getArticlsBySlug(req.params.slug);
  const notes = await notesService.getNotesBySlug(req.params.slug); // queryNotes({slug:req.params.slug},{ populate:'author' }, { fullText: 1,  slug: 1, createdAt: 1});
  res.send({ breadcrumbs, notes, category, categories, articls });
});

module.exports = {
  getHomePage,
  getArticlPage,
};
