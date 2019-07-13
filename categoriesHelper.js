const cacache = require('cacache/en');
const fs = require('fs');
const mongodb = require('./mongoDBFunction');

const categoryNamesKey = 'categoryNames';
const cachePath = './cache/';

const { getAllCategories } = require('./mongoDBFunction');

async function getCategoryNamesFromDatabase(req, res) {
  try {
    let categoryNames = await mongodb.getCategoryNames();
    categoryNames = categoryNames.map(category => category.name);
    console.log(categoryNames);
    res.status(200).json({ success: 'success', categoryNames });
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
}

async function getCategoryNames(req, res) {
  try {
    cacache.get.info(cachePath, categoryNamesKey)
      .then(async (result) => {
        if (result) {
          res.status(200).json({ success: 'success', result });
        } else {
          getCategoryNamesFromDatabase(req, res);
        }
      });
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
}
exports.getCategoryNames = getCategoryNames;

async function getCategories(req, res) {
  try {
    const categories = await cacache.get();
    getAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ errors: err });
  }

  /*
  await cacache.put(cachePath, key, result).then(() => {
    console.log(`Saved content to ${cachePath}.`);
  });
  cacache.get.stream(
    cachePath, 'my-categories',
  ).on('data', (data) => {
    console.log('get content, [1] is', data.toString());
  });
  */
}
exports.getCategories = getCategories;
// categories();
// let data = fs.readFileSync('./category.json', 'utf8');
// data = JSON.parse(data);
// const { categories } = data;
// console.log('do open');

// module.exports.categories = categories;
/*
const { getCategoriesNames } = require('./mongoDBFunction');

const categories2 = getAllCategories;
console.log('do a helper');
console.log(`categories is : ${categories[1]}`);

module.exports.categories = categories2;
*/
