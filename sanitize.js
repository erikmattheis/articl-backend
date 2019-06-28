// eslint-disable-next-line import/no-unresolved
const sanitizeHtml = require('sanitize-html');

function postQuestion(req, res, next) {
  try {
    req.body.name = sanitizeHtml(req.body.name);
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
