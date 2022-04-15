const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const articlsSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categorySlug: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      trim: true,
      default: 0,
    },
    postId: {
      type: String,
      required: true,
      trim: true,
    },
    postStatus: {
      type: String,
      required: true,
      trim: true,
    },
    postTitle: {
      type: String,
      required: true,
      trim: true,
    },
    postType: {
      type: String,
      required: false,
      trim: true,
    },
    abstract: {
      type: String,
      required: false,
      trim: true,
    },
    authors: { type: String, required: false, trim: true },
    city: { String, required: false, trim: true },
    country: { String, required: false, trim: true },
    dateEnd: { String, required: false, trim: true },
    dateStart: { String, required: false, trim: true },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    fullText: { String, required: false, trim: true },
    type: {
      type: String,
      required: false,
      trim: true,
    },
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
articlsSchema.plugin(toJSON);
articlsSchema.plugin(paginate);

/**
 * @typedef Articls
 */
const Articls = mongoose.model("Articls", articlsSchema);

module.exports = Articls;
