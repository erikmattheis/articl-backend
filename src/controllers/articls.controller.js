/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const passport = require("passport");
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
    "text",
    "title",
    "journal",
    "authors",
    "yearComparison",
    "year",
    "types",
    "statuses",
  ]);

  const titleValue = filter.title;
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
  if (filter.types) {
    filter.type = stringToArrayFilter(filter.types, ",");
    delete filter.types;
  }
  if (filter.statuses) {
    filter.status = stringToArrayFilter(filter.statuses, ",");
    delete filter.statuses;
  }

  let options = pick(req.query, ["sortBy", "limit", "page"]);
  options.sortBy = options.sortBy ? options.sortBy : "createdAt:desc";
  options.limit = options.limit ? Number(options.limit) : 10;
  options.page = options.page ? Number(options.page) : 1;
  projection = { title: 1, authors: 1, createdAt: 1, score: 1 };
  const result = await articlsService.queryArticls(filter, options, projection);

  if (titleValue) {
    result.results = result.results.map(function (obj) {
      obj.title = stringNearSubstring(obj.title, titleValue, 72);
      return obj;
    });
  }

  res.send(result);
});

function chopValue(str, subStr, len) {
  const position = str.toLowerCase().indexOf(subStr.toLowerCase());
  if (position + subStr.length < len) {
    return str.substring(0, len);
  }
  return str.substring(
    position - Math.floor(len / 2),
    position + Math.ceil(len / 2)
  );
}

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
