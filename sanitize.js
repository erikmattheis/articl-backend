// eslint-disable-next-line import/no-unresolved
const sanitizeHtml = require('sanitize-html');

function postQuestion(req, res, next) {
  try {
    req.body = sanitizeHtml(req.body);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

function getQuestion(req, res, next) {
  try {
    req.params = sanitizeHtml(req.params);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

exports.postQuestion = postQuestion;
exports.getQuestion = getQuestion;
