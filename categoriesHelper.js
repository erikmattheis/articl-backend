const cacache = require('cacache/en');
const mongodb = require('./mongoDBFunction');

const categoryNamesKey = 'categoryNames';
const cachePath = './cache/';

/*
mongodb.getCategoryNames()
.then((result) => {
  console.log('result', result);
  const categoryNames = result.map(category => category.name);
  res.status(200).json({ status: 'success', names: categoryNames });
})
.catch((error) => {
  console.log('err', error);
  res.status(500).json(JSON.stringify(error));
});
*/
/*

async function handleGetCategoryNamesResult(result) {
  if (result) {
    console.log('found cache');
    res.status(200).json({ success: 'success', categories: result });
  } else {
    getCategoryNamesFromDatabase(req, res);
  }
}
*/

/*
async function handleCachedResult(result) {
  if (!result) {
    console.log('getting from DB');
    const categoryNames = await getCategoryNamesFromDatabase();
    await saveCategoryNames(categoryNames);
    return categoryNames;
  }
  return result;
}
*/

async function saveCategoryNames(req, res, next, categoryNames) {
  try {
    console.log(`Saving content to ${cachePath}`);
    console.log('categoryNames', categoryNames);
    cacache.put(cachePath, categoryNamesKey, categoryNames)
      .then((result) => {
        console.log('saveCategoryNames result', result);
      })
      .catch((error) => {
        console.log('saveCategoryNames error:', error);
      });
  } catch (error) {
    throw new Error(error);
  }
}

async function noCacheHandler(req, res, next) {
  try {
    mongodb.getCategoryNames(req, res, next)
      .then(async (result) => {
        console.log('getCategoryNames result', result);
        await saveCategoryNames(req, res, next, result);
        res.status(200).json({ categoryNames });
      })
      .catch((error) => {
        console.log('getCategoryNames error', error);
      });
  } catch (error) {
    console.log('noCacheHandler', error);
  }
}

function getCachedCategoryNames() {
  return cacache.get(cachePath, categoryNamesKey);
}

async function getCategoryNames(req, res, next) {
  try {
    cacache.get.info(cachePath, categoryNamesKey);
    const categoryNames = await getCachedCategoryNames();
    res.status(200).json({ categoryNames });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('no such cache');
      noCacheHandler(req, res, next);
    } else {
      next(error);
    }
  }
}

exports.getCategoryNames = getCategoryNames;

/*
async function getCategories(req, res) {
  try {
    const categories = await cacache.get();
    getAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ errors: err });
  }
}
exports.getCategories = getCategories;


  cacache.get.stream(
    cachePath, 'my-categories',
  ).on('data', (data) => {
    console.log('get content, [1] is', data.toString());
  });
  */
// categories();
// let data = fs.readFileSync('./category.json', 'utf8');
// data = JSON.parse(data);
// const { categories } = data;
// console.log('do open');

// module.exports.categories = categories;
