const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

mongoose.set("debug", true);

const articlsSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    categorySlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      trim: true,
      default: 0,
    },
    oldId: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "Published",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
      index: true,
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
      index: true,
    },
    journal: {
      type: String,
      required: false,
      trim: true,
      index: true,
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

articlsSchema.index({ title: "text" }, { default_language: "english" });

// add plugin that converts mongoose to json
articlsSchema.plugin(toJSON);
articlsSchema.plugin(paginate);

/**
 * @typedef Articls
 */
const Articls = mongoose.model("Articls", articlsSchema);

module.exports = Articls;
