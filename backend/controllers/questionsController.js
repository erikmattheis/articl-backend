const mongoose = require('mongoose');
const questionsValidator = require('../validators/questionsValidator');
const { ValidationError } = require('../errors/errors');
const questionsData = require('../data/questionsData');

mongoose.Promise = Promise;

async function postQuestion(req, res, next) {
  try {
    await questionsValidator.postQuestion(req);
    const insertionResult = await questionsData.postQuestion(req);
    res.status(201).json({ question: insertionResult, success: 'success' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json({ error });
    }
    // res.status(500).json({ error });
    next(error);
  }
}
exports.postQuestion = postQuestion;

async function getQuestions(req, res) {
  try {
    const questions = await questionsData.getQuestions(req);
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error });
  }
}
exports.getQuestions = getQuestions;

async function deleteQuestions(req, res) {
  try {
    const result = await questionsData.deleteQuestions();
    if (result instanceof Error) {
      res.status(405).json(result);
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error });
  }
}
exports.deleteQuestions = deleteQuestions;
