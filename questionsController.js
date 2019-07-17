const mongodb = require('./mongoDBFunction');

function getQuestions(req, res) {
  if (req.query.category) {
    return mongodb.findQuestionByCategory(req, res);
  }
  if (req.query.author) {
    return mongodb.findQuestionByAuthor(req, res);
  }
  return mongodb.getQuestions(req, res);
}

module.exports.getQuestions = getQuestions;
