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

//  app.use(bodyParser.urlencoded({ extended: true }));

// find questions by name
// find quesions by category
app.get('/questions', sanitize.getQuestions, function getQuestion02(req, res) {
  if (req.query.name) {
    //  console.log(`debug name : ${req.query.name}`);
    return mongodb.findQuestionByName(req, res);
  }
  if (req.query.category) {
    //  console.log(`debug category : ${req.query.category}`);
    return mongodb.findQuestionByCategory(req, res);
  }
  return mongodb.getCollection('questions', res);
});

app.get('/delete', function getQuestions(req, res) {
  return mongodb.deleteCollection('questions', res);
});

app.post('/questions', sanitize.postQuestion, function postQuestion(req, res) {
  return mongodb.insertQuestion(req, res);
});

app.listen(3000);
console.log('listening to port 3000');

app.all('*', function finalClientError(req, res) {
  res.status(404).json({ errors: ['Resource not found.'] });
});
app.use(function finalError(req, res) {
  res.status(500).json({ errors: ['An unknown error occurred.'] });
});
