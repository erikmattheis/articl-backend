const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

mongoose.set("debug", true);
mongoose.set('useFindAndModify', false);


const articlsSchema = mongoose.Schema(
  {
    doi: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    authorsOrig: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    authors: [{
      nameFirst: String,
      nameLast: String,
      affilliations: [String]
    }],
    category: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    slug: {
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
      index: true,
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

const weights = {
  author: 2,
  slug: 9,
  title: 10,
  abstract: 7,
  authors: 5,
  affiliation: 5,
  description: 9,
  fullText: 6,
  url: 1,
  imageCaption: 10,
  institution: 5,
  journal: 5,
  shortTitle: 1,
  source: 2,
};

const fields = {};

for (i in weights) {
  fields[i] = "text";
}

articlsSchema.index(fields, {
  name: "Search Many Fields",
  weights: weights,
});

articlsSchema.set("toJSON", {
  virtuals: true,
});

articlsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// add plugin that converts mongoose to json
articlsSchema.plugin(toJSON);
articlsSchema.plugin(paginate);

/**
 * @typedef Articls
 */
const Articls = mongoose.model("Articls", articlsSchema);

module.exports = Articls;
