const mongojs = require('mongojs');

const url = 'mongodb://127.0.0.1:27017/articleDatabase';

const collections = ['questions'];

const mongoDBRef = mongojs(url, collections);

console.log('MongoDB is active.');

async function insertQuestion(req, res) {
  try {
    await mongoDBRef.collection('questions').save(
      {
        name: req.body.name,
        category: req.body.category,
        question: req.body.question,
        created: Date.now()
      },
      function insertQuestionResult(err, result) {
        if (err || !result) {
          return res
            .status(422)
            .json({ errors: ['The question failed to save in database.'] });
        }
        return res.status(201).json({
          message: 'Successfully saved question.',
          question: result
        });
      }
    );
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
}

module.exports.insertQuestion = insertQuestion;
