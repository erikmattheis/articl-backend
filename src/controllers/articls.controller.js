/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const passport = require("passport");
const config = require("../config/config");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const {
  textFilter,
  yearFilter,
  regexFilter,
  stringToArrayFilter,
} = require("../utils/searchFilters");
const { stringNearSubstring } = require("../utils/stringFunctions");
const { articlsService } = require("../services");

const createArticl = catchAsync(async (req, res) => {
  const articl = await articlsService.createArticl(req.body, req.user);
  res.status(httpStatus.CREATED).send(articl);
});

const getAnyArticlFieldValue = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await articlsService.getAnyArticlFieldValue(
    req.params.field,
    req.query.q,
    options
  );
  res.send(result);
});

const searchByWeight = catchAsync(async (req, res) => {
  
  const result = await articlsService.searchByWeight(req.query.q, req.query.searchFields);
  res.send(result);
});

const getArticls = catchAsync(async (req, res) => {
  let filter = pick(req.query, [
    "text",
    "title",
    "journal",
    "authors",
    "yearComparison",
    "year",
    "articlType",
  ]);

  let originalFilterValues = Object.assign({ ...filter });

  filter = makeArticlsFilter(filter);

  let options = pick(req.query, ["sortBy", "limit", "page"]);
  options.sortBy = options.sortBy ? options.sortBy : '{order'
  options = makeArticlsOptions(options);

  const projection = Object.assign({}, filter);

  for (var prop in projection) {
    projection[prop] = 1;
  }

  projection.id = 1;
  projection.order = 1;
  projection.title = 1;
  projection.articlType = 1;

  const result = await articlsService.queryArticls(filter, options, projection);

  for (let i = 0; i < result.results.length; i++) {
    ["title", "journal", "authors"].forEach((prop) => {
      if (
        result.results[i][prop] &&
        result.results[i][prop].length > config.shortResultMaxLength &&
        originalFilterValues[prop]
      ) {
        result.results[i].title = stringNearSubstring(
          result.results[i][prop],
          originalFilterValues[prop],
          config.shortResultMaxLength
        );
      }
    });
  }

  res.send(result);
});

function makeArticlsOptions(options) {
  options.sortBy = options.sortBy ? options.sortBy : "order:asc";
  options.limit = options.limit ? Number(options.limit) : 10;
  options.page = options.page ? Number(options.page) : 1;

  return options;
}

function makeArticlsFilter(filter) {
  if (filter.text) {
    filter.$text = textFilter(filter.text);
    delete filter.text;
  }
  if (filter.year && filter.yearComparison) {
    filter = yearFilter(filter);
  }
  if (filter.title) {
    filter.title = regexFilter(filter.title);
  }
  if (filter.authors) {
    filter.authors = regexFilter(filter.authors);
  }
  if (filter.journal) {
    filter.journal = regexFilter(filter.journal);
  }
  if (filter.articlType) {
    filter.articlType = stringToArrayFilter(filter.articlType, ",");
    delete filter.articlType;
  }
  return filter;
}

const getArticlById = catchAsync(async (req, res) => {
  const articl = await articlsService.getArticlById(req.params.id);
  res.send(articl);
});

const updateArticlsOrder = catchAsync(async (req, res) => {
  const result = await articlsService.updateArticlsOrder(req.body.order);
  res.send(result);
});

const updateArticl = catchAsync(async (req, res) => {
  const articl = await articlsService.updateArticlById(req.params.id, req.body, req.user);
  res.send(articl);
});

const deleteArticl = catchAsync(async (req, res) => {
  await articlsService.deleteArticlById(req.body.id, req.user);
  res.send();
});

module.exports = {
  createArticl,
  getAnyArticlFieldValue,
  getArticls,
  searchByWeight,
  getArticlById,
  updateArticl,
  updateArticlsOrder,
  deleteArticl,
};
