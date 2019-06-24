/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable func-names */
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./mongoDBFunction.js');

const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// app.use(bodyParser.urlencoded({ extended: false }));

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

//  example:
//  http://localhost:3000//findQuestion/abc
app.get('/findQuestion/:id', function(req, res) {
  console.log(`try to find: ${req.params.id}`);
  mongodb.findQuestion(req.params.id, function(result) {
    const question = result[0];
    if (question === undefined) {
      console.log('Not find.');
      const jsonResponse = {
        notification: 'can not find'
      };
      res.json(jsonResponse);
    } else {
      console.log(`Found: ${req.params.id}`);
      res.body = JSON.stringify(question.oneQuestion);
      res.send(res.body);
    }
  });
});

app.post('/postOneQuestionByJSON', jsonParser, function(req, res) {
  if (!req.body) return res.sendStatus(400);
  const oneQuestion = {
    id: req.body.id.toString(),
    name: req.body.name,
    category: req.body.category,
    question: req.body.question
  };
  mongodb.insertQuestion(oneQuestion);
  console.dir(req.body);
  const jsonResponse = {
    id: '123',
    status: 'updated'
  };
  res.json(jsonResponse);
});

app.post('/postOneQuestionByForm', urlencodedParser, function(req, res) {
  if (!req.body) return res.sendStatus(400);
  const oneQuestion = {
    id: req.body.id,
    name: req.body.name,
    category: req.body.category,
    question: req.body.question
  };
  mongodb.insertQuestion(oneQuestion);
  console.dir(req.body);
  const jsonResponse = {
    id: '123',
    status: 'updated'
  };
  res.json(jsonResponse);
});

app.listen(3000);
console.log('listening to port 3000');
