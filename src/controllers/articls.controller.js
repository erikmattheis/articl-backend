/* eslint-disable no-restricted-syntax */
const httpStatus = require("http-status");
const passport = require("passport");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { articlService } = require("../services");

const createArticl = catchAsync(async (req, res) => {
  const articl = await articlService.createArticl(req.body);
  res.status(httpStatus.CREATED).send(articl);
});

const getArticls = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["nameLast", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await articlService.queryArticls(filter, options);
  res.send(result);
});

const getArticl = catchAsync(async (req, res) => {
  const i = await passport.serializeArticl(function (articl, done) {
    done(null, articl.id);
  });
});

const updateArticl = catchAsync(async (req, res) => {
  const articl = await articlService.updateArticlById(req.params.id, req.body);
  res.send(articl);
});

const deleteArticl = catchAsync(async (req, res) => {
  await articlService.deleteArticlById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createArticl,
  getArticls,
  getArticl,
  updateArticl,
  deleteArticl,
};
