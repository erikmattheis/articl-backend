/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const paginate = require('express-paginate');
const { MongoError } = require('mongodb');
const sanitize = require('./sanitize');
const validate = require('./validate');
const mongodb = require('./mongoDBFunction');
const questionsController = require('./questionsController');
const categories = require('./categoriesHelper');


// const jsonParser = bodyParser.json();
const app = express();
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(generalLimiter);
app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
  enablePreflight: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use(paginate.middleware(10, 50));

app.get('/categories', categories.getCategoryNames);

app.post('/questions',

  async (req, res, next) => {
    let validationResult;
    let insertionResult;

    try {
      validationResult = await validate.postQuestion(req, res, next);
      if (validationResult instanceof Error) {
        console.log('validationResult Error in router', validationResult);
        next(validationResult);
      }
      // const sanitizationPassed = await sanitize.postQuestion(req, res);

      insertionResult = await mongodb.insertQuestion(req, res, next);
      if (insertionResult instanceof Error) {
        console.log('insertionResult Error in router', insertionResult);
        next(insertionResult);
      } else {
        res.status(201).json({ success: 'success', result: insertionResult });
      }
    } catch (error) {
      next(error);
    }
  });


app.get(
  '/questions/:id',
  validate.getQuestions,
  (req, res) => mongodb.findQuestionById(req, res),
);

app.get('/questions',
  validate.getQuestions,
  (req, res) => questionsController.getQuestions(req, res));

app.delete(
  '/questions',
  validate.deleteQuestions,
  (req, res) => {
    if (req.query.id) {
      return mongodb.deleteQuestionById(req, res);
    }
    return mongodb.deleteQuestion(res);
  },
);

// app.post('/questions', async (req, res) => {
//   await check('category')
//     .not()
//     .isEmpty()
//     .isLength({ min: 20 })
//     .withMessage(
//       'Your Q&A must have a question content at least five characters long.',
//     )
//     .run(req);

//   const result = await validationResult(req);
//   if (!result.isEmpty()) {
//     return res.status(422).json({ errors: result.array() });
//   }
//   return mongodb.insertQuestion(req, res);
//   // user can be created now!
// });


app.put(
  '/questions',
  validate.postQuestion,
  sanitize.postQuestion,
  (req, res) => {
    if (req.query.id) {
      return mongodb.updateQuestionById(req, res);
    }
    return res
      .status(422)
      .json({
        errors: ['You shoule give a specific conditon to find resources.'],
      });
  },
);

app.use((req, res) => {
  console.log('everything worked!', res);
  res.status(200).send({ res });
});

app.use((error, req, res, next) => {
  if (error instanceof MongoError) {
    return res.status(503).json({
      type: 'MongoError',
      message: error.message,
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
