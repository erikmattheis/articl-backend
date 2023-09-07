const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const articlsWPSchema = mongoose.Schema(
  {
    wpPost: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    oldId: {
      type: String,
      required: false,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

articlsWPSchema.set('toJSON', {
  virtuals: true,
});

articlsWPSchema.virtual('id').get(function doIt() {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

articlsWPSchema.index({
  oldId: 1,
});


// add plugin that converts mongoose to json
articlsWPSchema.plugin(toJSON);

async function drop() {
  const ArticlsWP = mongoose.model('ArticlsWP', articlsWPSchema);

  const articlesWPCollection = ArticlsWP.collection;

  // Get a list of all indexes
  const indexes = await articlesWPCollection.indexes();

  // Loop through the indexes and delete them
  for (const index of indexes) {
    if (index.name === '_id_') continue;
    await articlesWPCollection.dropIndex(index.name);
  }

}

//drop()

const ArticlsWP = mongoose.model('ArticlsWP', articlsWPSchema);

const init = async () => {

  await ArticlsWP.createIndexes();

}

init();

module.exports = ArticlsWP;

