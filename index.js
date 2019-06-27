const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sanitize = require('./sanitize');
const validate = require('./validate');
const mongodb = require('./mongoDBFunction');

const app = express();
app.use(helmet());
app.use(bodyParser.json());

app.post(
  '/questions',
  sanitize.postQuestion,
  validate.postQuestion,
  validate.checkValidationResult,
  function postQuestion(req, res) {
    mongodb.insertQuestion(req, res);
  }
);

app.all('*', function finalClientError(req, res) {
  res.status(404).json({ errors: ['Resource not found.'] });
});

app.use(function finalError(req, res) {
  res.status(500).json({ errors: ['An unknown error occurred.'] });
});

app.listen(3000);
console.log('listening to port 3000');
