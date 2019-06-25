/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable func-names */
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./mongoDBFunction.js');

const app = express();
const jsonParser = bodyParser.json();
//  const urlencodedParser = bodyParser.urlencoded({ extended: false });
//  app.use(bodyParser.urlencoded({ extended: true }));
//  app.use(bodyParser.json());

//  not finish
app.get('/allQuestions', function(req, res) {
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

app.get('/findQuestionByName/:name', function(req, res) {
  return mongodb.findQuestionByName(req, res);
});

app.get('/findQuestionByCategory/:category', function(req, res) {
  return mongodb.findQuestionByCategory(req, res);
});

app.post('/questions', jsonParser, function(req, res) {
  return mongodb.insertQuestion(req, res);
});

app.listen(3000);
console.log('listening to port 3000');
