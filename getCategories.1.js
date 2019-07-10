const { Category } = require('./mongoDBFunction');

async function getCategories(res) {
  console.log('try to find all categories');
  try {
    await Category
      .find((err, result) => {
        if (err || !result) {
          res.status(404).json({ errors: ['Failed to find database.'] });
          return true;
        }
        res.status(200).json({
          message: 'Successfully found database.',
          question: result,
        });
        return false;
      });
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
}
