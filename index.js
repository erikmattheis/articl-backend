/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const sanitize = require('./sanitize');
const validate = require('./validate');
const mongodb = require('./mongoDBFunction');
// const jsonParser = bodyParser.json();
const app = express();
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(generalLimiter);
app.use(helmet());
app.use(bodyParser.json());


//  app.use(bodyParser.urlencoded({ extended: true }));

// find questions by name
// find quesions by category
app.get('/questions',
  validate.getQuestions,
  validate.checkValidationResult,
  sanitize.getQuestions, (req, res) => {
    if (req.query.name) {
      return mongodb.findQuestionByName(req, res);
    }
    if (req.query.category) {
      return mongodb.findQuestionByCategory(req, res);
    }
    if (req.query.id) {
      return mongodb.findQuestionById(req, res);
    }
    return mongodb.getCollection('questions', res);
  });

app.delete('/questions', (req, res) => {
  if (req.query.id) {
    return mongodb.deleteQuestionById(req, res);
  }
  return mongodb.deleteQuestion(res);
});


// app.post(
//   '/questions',
//   sanitize.postQuestion,
//   validate.postQuestion,
//   validate.checkValidationResult,
//   (req, res) => {
//     mongodb.insertQuestion(req, res);
//   },
// );

app.post(
  '/questions',
  validate.postQuestion,
  validate.checkValidationResult,
  sanitize.postQuestion,
  (req, res) => {
    mongodb.insertQuestion(req, res);
  },
);

app.put(
  '/questions',
  (req, res) => {
    if (req.query.id) {
      return mongodb.updateQuestionById(req, res);
    }
    return res.status(422).json({ errors: ['You shoule give a specific conditon to find resources.'] });
  },
);

app.listen(3000);
console.log('listening to port 3000');

app.all('*', (req, res) => {
  res.status(404).json({ errors: ['Resource not found.'] });
});
app.use((req, res) => {
  res.status(500).json({ errors: ['An unknown error occurred.'] });
});
