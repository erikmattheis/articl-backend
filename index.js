const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sanitize = require('./sanitize');
const mongodb = require('./mongoDBFunction');

const app = express();
app.use(helmet());
app.use(bodyParser.json());

app.post('/questions', sanitize.postQuestion, function postQuestion(req, res) {
  mongodb.insertQuestion(req, res);
});

app.listen(3000);
console.log('listening to port 3000');
