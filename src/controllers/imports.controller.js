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
  res.status(httpStatus.CREATED).send('Imported ' + result + ' articls');
});

const importNotesByChr = catchAsync(async (req, res) => {
  const result = await importsService.importNotesByChr(req.params.chr);
  res.status(httpStatus.CREATED).send('Imported ' + result + ' notes');
});

module.exports = {
  importCategories,
  importArticlsByChr,
  importNotesByChr,
};
