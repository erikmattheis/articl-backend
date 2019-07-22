const { categoriesData } = require('../data/categoriesData');

async function getCategories(req, res, next) {
  console.log('getCategories');
  try {
    const result = await categoriesData.getCategoryNames(res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
exports.getCategories = getCategories;
