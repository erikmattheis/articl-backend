const mongodb = require('../mongoDBFunction');

async function getCategories(req, res, next) {
  console.log('getCategories');
  try {
    const result = await mongodb.getCategoryNames(res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
exports.getCategories = getCategories;
