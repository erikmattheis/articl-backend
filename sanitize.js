// eslint-disable-next-line import/no-unresolved
const sanitizeHtml = require('sanitize-html');

function postQuestion(req, res, next) {
  try {
    req.body.author = sanitizeHtml(req.body.author);
    req.body.name = sanitizeHtml(req.body.name);
    req.body.category = sanitizeHtml(req.body.category);
    req.body.question.question = sanitizeHtml(req.body.question.question);
    req.body.question.answers.id = sanitizeHtml(req.body.question.answers.id);
    req.body.question.answers.answer = sanitizeHtml(req.body.question.answers.answer);
    req.body.question.answers.correct = sanitizeHtml(req.body.question.answers.correct);
    req.body.question.answers.explanation = sanitizeHtml(req.body.question.answers.explanation);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

function getQuestions(req, res, next) {
  try {
    if (req.query.name) {
      req.query.name = sanitizeHtml(req.query.name);
    }
    if (req.query.category) {
      req.query.category = sanitizeHtml(req.query.category);
    }
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

exports.postQuestion = postQuestion;
exports.getQuestions = getQuestions;
