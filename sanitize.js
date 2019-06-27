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

function getQuestionByName(req, res, next) {
  try {
    req.params.name = sanitizeHtml(req.params.name);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

function getQuestionByCategory(req, res, next) {
  try {
    req.params.category = sanitizeHtml(req.params.category);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}
exports.postQuestion = postQuestion;
exports.getQuestionByName = getQuestionByName;
exports.getQuestionByCategory = getQuestionByCategory;
