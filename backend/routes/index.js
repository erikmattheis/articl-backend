const express = require('express');
const { categoriesController, questionsController } = require('../controllers');
const { FileNotFoundError, DatabaseError } = require('../errors/errors.js');

const router = express.Router();

module.exports = router;

router.get('/categories', categoriesController.getCategories);

router.get('/questions', questionsController.getQuestions);

router.get('/questions/:id', questionsController.getQuestions);

router.post('/questions', questionsController.postQuestion);

router.delete('/questions', questionsController.deleteQuestions);

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

router.use((error, req, res, next) => {
  console.log('caught last');
  let result = error;
  if (error.name === 'MongoError') {
    result = new DatabaseError(error.errmsg);
  }
  res.status(500).json({ result });
});

router.use((req, res, next) => {
  console.log('404 caught here');
  const error = new FileNotFoundError();
  res.status(404).json({ error });
});
