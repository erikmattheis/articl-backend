const { MongoError } = require('mongodb');
const sanitize = require('./sanitize');
const validate = require('./validate');

const mongodb = require('./mongoDBFunction');
const questionsController = require('./questionsController');
const categories = require('./categoriesHelper');

const app = require('./server/expressApp.js');

app.get('/categories', mongodb.getCategoryNames);

app.post(
  '/questions',

  async (req, res, next) => {
    let validationResult;
    let insertionResult;

    try {
      validationResult = await validate.postQuestion(req, res, next);
      // console.log('validationResult', validationResult);
      if (validationResult instanceof Error) {
        console.log('validationResult Error in router', validationResult);
        return next(validationResult);
      }
      // const sanitizationPassed = await sanitize.postQuestion(req, res);

      insertionResult = await mongodb.insertQuestion(req, res, next);
      if (insertionResult instanceof Error) {
        console.log('insertionResult Error in router', insertionResult);
        return next(insertionResult);
      }
      return res.status(201).json({ success: 'success', result: insertionResult });
    } catch (error) {
      console.log('catch in router', error);
      return next(error);
    }
  }
);

app.use((req, res) => {
  console.log('everything worked!', res);
  res.status(200).send({ res });
});

app.use((error, req, res, next) => {
  if (error instanceof MongoError) {
    res.status(503).json({
      type: 'MongoError',
      message: error.message
    });
  }
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err.message);
  const error = err;
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  res.status(err.statusCode).send({ errors: error });
  next();
});

app.listen(3000);
console.log('listening to port 3000');

/*
app.all('*', (req, res) => {
  res.status(404).json({ errors: ['Resource not found.'] });
});
app.use((req, res) => {
  res.status(500).json({ errors: ['An unknown error occurred.'] });
});
*/
