const { Category } = require('./categoriesSchema');
const cachedResults = require('../cachedResults');
const timer = require('../utils/timer');
const memory = require('../utils/memory');

async function getCategoryNames() {
  try {
    timer.start('cachedResults');
    const cached = await cachedResults.getValue('getCategoryNames');
    timer.stop('cachedResults');
    if (cached) {
      return cached;
    }

    console.info(timer);
    timer.start('CategoryDistinct');
    const result = await Category.distinct('title').exec();
    timer.stop('CategoryDistinct');
    if (result.length) {
      console.log('result', result);
      console.log('result.length', result.length);
      console.log(memory.sizeof(result, 'result'));
      return result;
    }
    return Error('No categories were found.');
  } catch (error) {
    console.log('getCategoryNames error', error);
    return error;
  }
}
module.exports.getCategoryNames = getCategoryNames;

async function getCategories(res) {
  try {
    const category = await Category.find();
    return category;
  } catch (error) {
    return error;
  }
}
exports.getCategories = getCategories;

async function getAllCategories() {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    return error;
  }
}
module.exports.getAllCategories = getAllCategories;
