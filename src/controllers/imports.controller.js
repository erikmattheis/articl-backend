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
  }
  if (chr !== null && chr.charCodeAt(0) < 123) {
    req.params.chr = chr;
    importArticlsByChr(req, res);
    //res.redirect(`/v1/imports/import-articls/${chr}`);
  }
  else {
    res.status(httpStatus.CREATED).send(`Done`);
  }
});

const importNotesByChr = catchAsync(async (req, res) => {
  const chr = await importsService.importNotesByChr(req.params.chr, req.user?.id);
  if (chr) {
    res.redirect(`/api/v1/imports/notes/${req.params.chr}`);
  }
  else {
    res.status(httpStatus.CREATED).send(`Done`);
  }
});

const importNotes = catchAsync(async (req, res) => {
  const n = await importsService.importNotes(req.user?.id);
  res.status(httpStatus.CREATED).send(`Done ${n}`);
});

module.exports = {
  importCategories,
  importArticlsByChr,
  importNotesByChr,
  importNotes,
};
