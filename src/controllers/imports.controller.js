/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { importsService } = require('../services');

const importCategories = catchAsync(async (req, res) => {
  const result = await importsService.importCategories();
  res.status(httpStatus.CREATED).send(result);
});

const importArticlsByChr = catchAsync(async (req, res) => {
  let chr = '';
  if (req.params.chr?.length > 0) {

    chr = await importsService.importArticlsByChr(req.params.chr);
    console.log('next chr is', chr);
  }
  if (chr) {
    res.redirect(`/v1/imports/import-articls/${chr}`);
  }
  else {
    res.status(httpStatus.CREATED).send(`Done`);
  }
});

const importNotesByChr = catchAsync(async (req, res) => {
  const chr = await importsService.importNotesByChr(req.params.chr);
  if (chr) {
    res.redirect(`/api/v1/imports/notes/${req.params.chr}`);
  }
  else {
    res.status(httpStatus.CREATED).send(`Done`);
  }
});

module.exports = {
  importCategories,
  importArticlsByChr,
  importNotesByChr,
};
