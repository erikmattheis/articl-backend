const mongojs = require('mongojs');

const url = 'mongodb://127.0.0.1:27017/articleDatabase';

const collections = ['questions'];

const mongoDBRef = mongojs(url, collections);

console.log('MongoDB is active.');

function insertQuestion(req, res) {
  try {
    mongoDBRef
      .collection('questions')
      .save(
        { name: req.body.name, category: req.body.category },
        function insertQuestionResult(err, result) {
          if (err || !result) {
            res
              .status(422)
              .json({ errors: ['The question failed to save in database.'] });
          } else {
            res.status(201).json({
              message: 'Successfully saved question.',
              question: result
            });
          }
        }
      );
  } catch (e) {
    res.status(422).json({ errors: e.mapped() });
  }
}

module.exports.insertQuestion = insertQuestion;
