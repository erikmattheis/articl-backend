/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const groupBy = require("lodash/groupBy");
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");
const { categoriesService, articlsService, notesService } = require("../services");

const getHomePage = catchAsync(async (req, res) => {
  const category = await categoriesService.getCategoryBySlug("0");
  const categories = await categoriesService.getCategoriesByParentSlug("0");
  const count = await articlsService.getArticlCount();
  res.send({ category, categories, count });
});

const getArticlPage = catchAsync(async (req, res) => {
  const slug = decodeURI(req.params.slug);
  const breadcrumbs = await categoriesService.getBreadcrumbs(slug);
  const category = await categoriesService.getCategoryBySlug(slug);
  if (Object.keys(category).length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
  }
  const categories = await categoriesService.getCategoriesByParentSlug(
    slug
  );
  const articls = await articlsService.getArticlsBySlug(slug);
  
  const groupedArticls = groupBy(articls, (articl) => articl?.type);

  const groupedArticlsArray = Object.entries(groupedArticls).map(([key, value]) => ({ [key]: value }));

  
  const count = await articlsService.getArticlCount();
  
  const notes = await notesService.getNotesBySlug(slug); // queryNotes({slug:req.params.slug},{ populate:'author' }, { fullText: 1,  slug: 1, createdAt: 1});
  res.send({ breadcrumbs, notes, category, categories, articls: groupedArticlsArray, count });
});

module.exports = {
  getHomePage,
  getArticlPage,
};
