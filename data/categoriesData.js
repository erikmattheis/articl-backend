const { mongoose } = require('./mongoDB');

const categorySchema = new mongoose.Schema({
  category_image: String,
  description: String,
  parent: { index: true, type: Number },
  term_id: Number,
  title: { index: true, type: String }
});

const Category = mongoose.model('Category', categorySchema);
const cachedResults = require('../cachedResults');
const timer = require('../utils/timer');
const memory = require('../utils/memory');

// timer.start('cachedResults');

async function getCachedResult(key) {
  try {
    return await cachedResults.getValue(key);
  } catch (error) {
    throw error;
  }
}

async function getCategoryNames() {
  try {
    return Category.distinct('title').exec();
    // console.log('result', result);

    /*
    result
      .then(resolved => {
        console.log('now result.length is', resolved.length);
        return resolved;
      })
      .catch(error => {
        console.log('error of', error);
        throw error;
      });

      */
    /*
    const cachedResult = getCachedResult('getCategoryNames');
    if (cachedResult.length) {
      return cachedResult;
    }
    console.log('waiting for mongoose');
    const result = Category.distinct('title');
    console.log('done waiting for mongoose', result);
    result
      .then(function(err, result) {
        console.log('then err', err);
        console.log('then result', result);
        return result;
      })
      .catch(function(error) {
        console.log('catch error', error);
        return error;
      });
      */
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
