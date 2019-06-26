/* eslint-disable import/no-unresolved */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sanitize = require('./sanitize');
const mongodb = require('./mongoDBFunction');
// const jsonParser = bodyParser.json();
const app = express();

app.use(helmet());
app.use(bodyParser.json());

//  const urlencodedParser = bodyParser.urlencoded({ extended: false });
//  app.use(bodyParser.urlencoded({ extended: true }));
//  app.use(bodyParser.json());

//  not finish
app.get('/allQuestions', function getQuestions(req, res) {
  const responseObject = [
    {
      name: 'haha'
    },
    {
      name: 'yue'
    }
  ];
  res.send(responseObject);
});

app.get('/findQuestionByName/:name', function getQuestion01(req, res) {
  return mongodb.findQuestionByName(req, res);
});

app.get('/findQuestionByCategory/:category', function getQuestion02(req, res) {
  return mongodb.findQuestionByCategory(req, res);
});

app.post('/questions', sanitize.postQuestion, function postQuestion(req, res) {
  return mongodb.insertQuestion(req, res);
});

app.listen(3000);
console.log('listening to port 3000');
