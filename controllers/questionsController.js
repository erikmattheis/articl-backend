const mongoose = require('mongoose');
const questionsValidator = require('../validators/questionsValidator');
const questionsData = require('../data/questionsData');

mongoose.Promise = Promise;

async function postQuestion(req, res) {
  try {
    const validationResult = await questionsValidator.postQuestion(req);
    console.log('controller validation', validationResult);
    const insertionResult = await questionsData.postQuestion(req);
    console.log('insertionResult', insertionResult);
    res.status(201).json({ question: insertionResult, success: 'success' });
  } catch (error) {
    console.log('cntr postQuestion error', error);
    throw error;
  }
}
exports.postQuestion = postQuestion;
