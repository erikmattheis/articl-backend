const cacache = require('cacache/en');
const fs = require('fs');
const mongodb = require('./mongoDBFunction');

const key = 'my-categories';
const cachePath = './cache/';
const { getAllCategories } = require('./mongoDBFunction');


async function categories() {
  const result = await getAllCategories();
  await cacache.put(cachePath, key, result).then(() => {
    console.log(`Saved content to ${cachePath}.`);
  });
//   cacache.get.stream(
//     cachePath, 'my-categories',
//   ).on('data', (data) => {
//     console.log('get content, [1] is', data.toString());
//   });
}
categories();
// let data = fs.readFileSync('./category.json', 'utf8');
// data = JSON.parse(data);
// const { categories } = data;
// console.log('do open');

// module.exports.categories = categories;

// const { getCategoriesNames } = require('./mongoDBFunction');

// const categories = getAllCategories;
// console.log('do a helper');
// console.log(`categories is : ${categories[1]}`);

module.exports.categories = categories;
