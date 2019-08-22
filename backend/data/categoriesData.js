const { mongoose } = require('./mongoDB');

const categorySchema = new mongoose.Schema({
  category_image: String,
  description: String,
  parent: { index: true, type: Number },
  term_id: Number,
  title: { index: true, type: String }
});

const Category = mongoose.model('Category', categorySchema);
const cache = require('../cache');
// const timer = require('../utils/timer');
// const memory = require('../utils/memory');

/*
function trimValues() {
  const batch = [];
  Category.find({ title: /^\s+|\s+$/ }, { title: 1 }).then(title => {
    title.forEach(function doTrim(doc) {
      batch.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { title: doc.title.trim() } }
        }
      });
    });

    Category.bulkWrite(batch);
  });
}

trimValues();
*/

async function getCategoryNames() {
  try {
    let categoryNames = await cache.getValue('categoryNames');
    if (categoryNames) {
      return Promise.resolve(categoryNames);
    }
    categoryNames = await Category.distinct('title').exec();
    cache.setValue('categoryNames', categoryNames);
    return Promise.resolve(categoryNames);
  } catch (error) {
    throw error;
  }
}
module.exports.getCategoryNames = getCategoryNames;

async function getCategories() {
  try {
    const category = await Category.find();
    return category;
  } catch (error) {
    throw error;
  }
}
exports.getCategories = getCategories;

async function getAllCategories() {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw error;
  }
}
module.exports.getAllCategories = getAllCategories;
