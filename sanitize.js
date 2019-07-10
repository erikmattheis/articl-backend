// eslint-disable-next-line import/no-unresolved
const sanitizeHtml = require('sanitize-html');
const xss = require('xss');

function postQuestion(req, res, next) {
  try {
    req.body.question.question = sanitizeHtml(req.body.question.question);
    req.body.question.answers.answer = sanitizeHtml(req.body.question.answers.answer);
    req.body.question.answers.explanation = sanitizeHtml(req.body.question.answers.explanation);
    req.body.question.question = xss(req.body.question.question);
    req.body.question.answers.answer = xss(req.body.question.answers.answer);
    req.body.question.answers.explanation = xss(req.body.question.answers.explanation);
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  return next();
}

// function getQuestions(req, res, next) {
//   try {
//     if (req.query.name) {
//       req.query.name = sanitizeHtml(req.query.name);
//     }
//     if (req.query.category) {
//       req.query.category = sanitizeHtml(req.query.category);
//     }
//   } catch (err) {
//     return res.status(422).json({ errors: [err] });
//   }
//   return next();
// }

exports.postQuestion = postQuestion;
// exports.getQuestions = getQuestions;
