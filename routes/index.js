const express = require('express');
const { MongoError } = require('mongodb');
const { categories, questions } = require('../controllers');

const router = express.Router();

module.exports = router;

router.get('/categories', categories.getCategories);

router.post('/questions', questions.postQuestion);

/*
router.use((req, res) => {
  console.log('everything worked!', res.body);
  res.status(200).send({ res });
});

router.use((error, req, res, next) => {
  if (error instanceof MongoError) {
    res.status(503).json({
      type: 'MongoError',
      message: error.message
    });
  }
  next(error);
});

router.use((err, req, res, next) => {
  console.log('`MESSAGE: ', err.message);
  const error = err;
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  res.status(err.statusCode).send({ errors: error });
  next();
});
*/
/*
app.all('*', (req, res) => {
  res.status(404).json({ errors: ['Resource not found.'] });
});
app.use((req, res) => {
  res.status(500).json({ errors: ['An unknown error occurred.'] });
});

*/
