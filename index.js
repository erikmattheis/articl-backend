/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const paginate = require('express-paginate');
const {
  check,
  validationResult,
} = require('express-validator');
const sanitize = require('./sanitize');
const validate = require('./validate');
const mongodb = require('./mongoDBFunction');
const { asyncFunction } = require('./asyncFunction');
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

//  app.use(bodyParser.urlencoded({ extended: true }));

app.get('/categories', asyncFunction(async (req, res, next) => categories.getCategoryNames(req, res, next)));

app.get(
  '/questions/:id',
  validate.getQuestions,
  validate.checkValidationResult,
  (req, res) => mongodb.findQuestionById(req, res),
);

app.get('/questions',
  validate.getQuestions,
  validate.checkValidationResult,
  (req, res) => questionsController.getQuestions(req, res));

app.delete(
  '/questions',
  validate.deleteQuestions,
  validate.checkValidationResult,
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

app.post('/questions', validate.postQuestion, mongodb.insertQuestion);

app.put(
  '/questions',
  validate.postQuestion,
  validate.checkValidationResult,
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
