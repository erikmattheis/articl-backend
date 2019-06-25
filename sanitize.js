const sanitizeHtml = require('sanitize-html');

function postQuestion(req, res, next) {
  try {
    req.body.name = sanitizeHtml(req.body.name);
    req.body.category = sanitizeHtml(req.body.category);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

exports.postQuestion = postQuestion;
