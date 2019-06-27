/* eslint-disable import/no-unresolved */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const sanitize = require('./sanitize');
const mongodb = require('./mongoDBFunction');
// const jsonParser = bodyParser.json();
const app = express();
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

app.use(generalLimiter);
app.use(helmet());
app.use(bodyParser.json());
// app.use(function finalError(req, res) {
//   res.status(500).json({ errors: ['An unknown error occurred.'] });
// });
// app.all('*', function finalClientError(req, res) {
//   res.status(404).json({ errors: ['Resource not found.'] });
// });

//  app.use(bodyParser.urlencoded({ extended: true }));

app.get('/questions', function getQuestions(req, res) {
  return mongodb.getCollection('questions', res);
});

app.get(
  '/findQuestionByName/:name',
  sanitize.getQuestion,
  function getQuestion01(req, res) {
    return mongodb.findQuestionByName(req, res);
  }
);

app.get(
  '/findQuestionByCategory/:category',
  sanitize.getQuestion,
  function getQuestion02(req, res) {
    return mongodb.findQuestionByCategory(req, res);
  }
);

app.post('/questions', sanitize.postQuestion, function postQuestion(req, res) {
  return mongodb.insertQuestion(req, res);
});

app.listen(3000);
console.log('listening to port 3000');
