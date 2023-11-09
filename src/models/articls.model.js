const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const articlsSchema = mongoose.Schema(
  {

    category: {
      type: String,
      required: false,
      trim: true,

    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: false,
      trim: true,
      default: 0,
    },
    oldId: {
      type: String,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    authors: {
      type: Array,
    },
    articlType: {
      type: String,
      required: true,
      trim: true,
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
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      trim: true,
      ref: 'User',
    },
    oldUserId: {
      type: String,
      required: false,
      trim: true,
    },
    wpPost: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },

  },
  {
    timestamps: true,
  },
);

const weights = {
  slug: 9,
  title: 10,
  abstract: 7,
  authors: 5,
  description: 9,
  fullText: 6,
  url: 1,
  imageCaption: 10,
  institution: 5,
  journal: 5,
  shortTitle: 1,
  source: 2,
  articlType: 10,
};

const fields = {};

Object.assign(fields, weights);

articlsSchema.set('toJSON', {
  virtuals: true,
});

articlsSchema.virtual('id').get(function doIt() {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

articlsSchema.index({
  category: 1,
  title: 1,
  /*
  slug: 1,
  authors: 1,
  articlType: 1,
  abstract: 1,
  description: 1,
  year: 1,
  imageCaption: 1,
  institution: 1,
  journal: 1,
  shortTitle: 1,
  */
});


// add plugin that converts mongoose to json
articlsSchema.plugin(toJSON);
articlsSchema.plugin(paginate);

async function drop() {
  const Articls = mongoose.model('Articls', articlsSchema);

  const articlesCollection = Articls.collection;

  // Get a list of all indexes
  const indexes = await articlesCollection.indexes();

  // Loop through the indexes and delete them
  for (const index of indexes) {
    if (index.name === '_id_') continue;
    await articlesCollection.dropIndex(index.name);
  }

  /*
  Articls.collection.createIndex({
    title: "text",
    journal: "text",
    institution: "text",
    abstract: "text",
    articlType: "text",
  });
  */

}

//drop()

const Articls = mongoose.model('Articls', articlsSchema);
/*
const init = async () => {

  await Articls.createIndexes();

}

init();

async function updateFieldName() {
try {
  // Use the updateMany method with the $rename operator to change the field name
  const updateResult = await Articls.updateMany(
    {},
    { $rename: { "type": "articlType" } }
  );

  console.log(`${updateResult.n} documents updated.`);
} catch (error) {
  console.error("Error occurred:", error);
}
}

updateFieldName();
*/

module.exports = Articls;

