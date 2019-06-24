/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const mongojs = require('mongojs');

const url = 'mongodb://127.0.0.1:27017/articleDatabase';

const collections = ['questions'];

const mongoDBRef = mongojs(url, collections);

console.log('MongoDB is active.');

function insertQuestion(oneQuestion) {
  mongoDBRef
    .collection('questions')
    .save({ id: oneQuestion.id, oneQuestion }, function(err, result) {
      if (err || !result)
        console.log('This question failed to save in database.');
      else
        console.log(
          'This question inserted into questions collection in MongoDB.'
        );
    });
}

function findQuestion(questionId, callback) {
  mongoDBRef
    .collection('questions')
    .find({ id: questionId })
    .toArray(function(err, docs) {
      if (!err) {
        console.log('Found the following records');
        console.log(docs);
        callback(docs);
      } else console.log('Question not found.');
    });
}

function getCollection(collectionName, callback) {}
module.exports.insertQuestion = insertQuestion;
module.exports.findQuestion = findQuestion;
module.exports.getCollection = getCollection;
