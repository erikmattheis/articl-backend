/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const mongojs = require('mongojs');

const url = 'mongodb://127.0.0.1:27017/articleDatabase';

const collections = ['questions'];

const mongoDBRef = mongojs(url, collections);

console.log('MongoDB is active.');

function insertQuestion(req, res) {
  const oneQuestion = req.body;
  try {
    mongoDBRef.collection('questions').save(
      {
        id: req.body.id, // just for test, will be deleted
        name: req.body.name,
        category: req.body.category,
        oneQuestion
      },
      function insertQuestionResult(err, result) {
        if (err || !result) {
          res
            .status(422)
            .json({ errors: ['The question failed to save in database.'] });
        } else {
          res.status(201).json({
            message: 'Successfully saved question.',
            question: result
          });
        }
      }
    );
  } catch (e) {
    res.status(422).json({ errors: e.mapped() });
  }
}

function findQuestionByName(req, res) {
  console.log(`try to find: ${req.params.name}`);
  try {
    mongoDBRef
      .collection('questions')
      .find({ name: req.params.name })
      .toArray(function insertQuestionResult(err, result) {
        if (err || !result) {
          res
            .status(404)
            .json({ errors: ['The question failed to find in database.'] });
        } else {
          res.status(302).json({
            message: 'Successfully found question.',
            question: result
          });
        }
      });
  } catch (e) {
    res.status(404).json({ errors: e.mapped() });
  }
}

function getCollection(collectionName, callback) {}
module.exports.insertQuestion = insertQuestion;
module.exports.findQuestionByName = findQuestionByName;
module.exports.getCollection = getCollection;
