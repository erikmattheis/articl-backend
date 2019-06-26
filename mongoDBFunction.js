const mongojs = require('mongojs');

const url = 'mongodb://127.0.0.1:27017/articleDatabase';

const collections = ['questions'];

const mongoDBRef = mongojs(url, collections);

console.log('MongoDB is active.');

function insertQuestion(req, res) {
  const oneQuestion = req.body;
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  const dateTime = `${date} ${time}`;

  mongoDBRef.collection('questions').save(
    {
      name: req.body.name,
      category: req.body.category,
      dateTime,
      oneQuestion
    },
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
}

function findQuestionByName(req, res) {
  console.log(`try to find: ${req.params.name}`);
  const regName = RegExp(req.params.name, 'i');
  try {
    mongoDBRef
      .collection('questions')
      .find({ name: { $regex: regName } })
      .toArray(function findQuestionResult(err, result) {
        if (err || result[0] === undefined) {
          res
            .status(404)
            .json({ errors: ['The question failed to find by name.'] });
        } else {
          res.status(302).json({
            message: 'Successfully found question.',
            question: result
          });
        }
      });
  } catch (e) {
    res.status(404).json({ errors: e.mapped() });
  }
}

function findQuestionByCategory(req, res) {
  console.log(`try to find: ${req.params.category}`);
  const regCategory = RegExp(req.params.category, 'i');
  try {
    mongoDBRef
      .collection('questions')
      .find({ category: { $regex: regCategory } })
      .toArray(function findCategoryResult(err, result) {
        if (err || result[0] === undefined) {
          res
            .status(404)
            .json({ errors: ['The question failed to find by category.'] });
        } else {
          res.status(302).json({
            message: 'Successfully found question.',
            question: result
          });
        }
      });
  } catch (e) {
    res.status(404).json({ errors: e.mapped() });
  }
}

function getCollection(collectionName, res) {
  console.log(`try to find: ${collectionName}`);
  try {
    mongoDBRef
      .collection(collectionName)
      .find(function getCollectionResult(err, result) {
        if (err || !result) {
          res.status(404).json({ errors: ['Failed to find database.'] });
          return true;
        }
        res.status(302).json({
          message: 'Successfully found database.',
          question: result
        });
        return false;
      });
  } catch (e) {
    res.status(404).json({ errors: e.mapped() });
  }
}

// function getCollection(collectionName, callback) {}
module.exports.insertQuestion = insertQuestion;
module.exports.findQuestionByName = findQuestionByName;
module.exports.findQuestionByCategory = findQuestionByCategory;
module.exports.getCollection = getCollection;
// module.exports.getCollection = getCollection;
