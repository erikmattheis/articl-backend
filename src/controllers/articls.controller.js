/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const passport = require("passport");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { yearFilter, regexFilter } = require("../utils/searchFilters");
const { articlsService } = require("../services");

const createArticl = catchAsync(async (req, res) => {
  const articl = await articlsService.createArticl(req.body);
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

const getArticls = catchAsync(async (req, res) => {
  let filter = pick(req.query, [
    "title",
    "journal",
    "authors",
    "yearComparison",
    "year",
    "source",
    "type",
    "status",
  ]);
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

  let options = pick(req.query, ["sortBy", "limit", "page"]);
  console.log("options1", options);
  options.sortBy = options.sortBy ? options.sortBy : "createdAt:desc";
  options.limit = options.limit ? Number(options.limit) : 10;
  options.page = options.page ? Number(options.page) : 1;

  console.log("options2", options);
  const result = await articlsService.queryArticls(filter, options);
  res.send(result);
});

/*
const articlsSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    abstract: {
      type: String,
      required: false,
      trim: true,
    },
    authors: { type: String, required: false, trim: true },
    affiliation: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    dateEnd: { type: String, required: false, trim: true },
    dateStart: { type: String, required: false, trim: true },
    description: {
      type: String,
      required: false,
      trim: false,
    },
    fullText: { type: String, required: false, trim: true },
    year: {
      type: Number,
      required: false,
      trim: true,
    },
    thumbnailImage: {
      type: String,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: false,
      trim: true,
    },
    venue: {
      type: String,
      required: false,
      trim: true,
    },
    imageCaption: {
      type: String,
      required: false,
      trim: true,
    },
    imageLocalPath: {
      type: String,
      required: false,
      trim: true,
    },
    imageOriginalUrl: {
      type: String,
      required: false,
      trim: true,
    },
    imageRemotePath: {
      type: String,
      required: false,
      trim: true,
    },
    institution: {
      type: String,
      required: false,
      trim: true,
    },
    journal: {
      type: String,
      required: false,
      trim: true,
    },
    month: {
      type: String,
      required: false,
      trim: true,
    },
    resourceType: {
      type: String,
      required: false,
      trim: true,
    },
    reviewSource: {
      type: String,
      required: false,
      trim: true,
    },
    reviewUrl: {
      type: String,
      required: false,
      trim: true,
    },
    shortTitle: {
      type: String,
      required: false,
      trim: true,
    },
    source: {
      type: String,
      required: false,
      trim: true,
    },
    sourceId: {
      type: String,
      required: false,
      trim: true,
    },
    sourceIdType: {
      type: String,
      required: false,
      trim: true,
    },
    startDate: {
      type: String,
      required: false,
      trim: true,
    },
    state: {
      type: String,
      required: false,
      trim: true,
    },
    articlUrl: "",
  },
  {
    timestamps: true,
  }
);
*/
const updateArticl = catchAsync(async (req, res) => {
  const articl = await articlsService.updateArticlById(req.params.id, req.body);
  res.send(articl);
});

const deleteArticl = catchAsync(async (req, res) => {
  await articlsService.deleteArticlById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createArticl,
  getAnyArticlFieldValue,
  getArticls,
  updateArticl,
  deleteArticl,
};
