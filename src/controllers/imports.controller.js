/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { importsService } = require("../services");

const importCategories = catchAsync(async (req, res) => {
  const result = await importsService.importCategories();
  res.status(httpStatus.CREATED).send(result);
});

const importArticlsByChr = catchAsync(async (req, res) => {
  const result = await importsService.importArticlsByChr(req.params.chr);
  console.log('result',result)
  res.status(httpStatus.CREATED).send('result');
});

module.exports = {
  importCategories,
  importArticlsByChr,
};
