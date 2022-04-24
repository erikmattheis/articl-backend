/* eslint-disable no-restricted-syntax */
// const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");
const { categoriesService, articlsService } = require("../services");

const getHomePage = catchAsync(async (req, res) => {
  const category = await categoriesService.getCategoryBySlug("0");
  const categories = await categoriesService.getCategoriesByparentSlug("0");
  res.send({ category, categories });
});

const getArticlPage = catchAsync(async (req, res) => {
  const category = await categoriesService.getCategoryBySlug(req.params.slug);
  const categories = await categoriesService.getCategoriesByparentSlug(
    req.params.slug
  );
  const articls = await articlsService.getArticlsBySlug(req.params.slug);
  res.send({ category, categories, articls });
});

module.exports = {
  getHomePage,
  getArticlPage,
};
