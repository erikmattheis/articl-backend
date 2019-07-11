// eslint-disable-next-line import/no-unresolved
const sanitizeHtml = require('sanitize-html');
const xss = require('xss');

function postQuestion(req, res, next) {
  try {
    req.body.question.question = sanitizeHtml(req.body.question.question);
    req.body.question.answers.forEach((answer, i) => {
      req.body.question.answers[i].answer = sanitizeHtml(answer.answer);
      req.body.question.answers[i].explanation = sanitizeHtml(answer.explanation);
    });
    req.body.question.question = xss(req.body.question.question);
    req.body.question.answers.forEach((answer, i) => {
      req.body.question.answers[i].answer = xss(answer.answer);
      req.body.question.answers[i].explanation = xss(answer.explanation);
    });
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
