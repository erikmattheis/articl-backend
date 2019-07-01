/* eslint-disable no-console */
const mongojs = require('mongojs');

const url = 'mongodb://127.0.0.1:27017/articleMongoJSDatabase';

const collections = ['questions'];

const mongoDBRef = mongojs(url, collections);

console.log('MongoDB is active.');

async function insertQuestion(req, res) {
  const oneQuestion = req.body;
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth()
    + 1}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  const dateTime = `${date} ${time}`;
  await mongoDBRef.collection('questions').save(
    {
      name: req.body.name,
      category: req.body.category,
      dateTime,
      oneQuestion,
    },
    (err, result) => {
      if (err || !result) {
        res
          .status(422)
          .json({ errors: ['The question failed to save in database.'] });
      } else {
        res.status(201).json({
          message: 'Successfully saved question.',
          question: result,
        });
      }
    },
  );
}

async function findQuestionByName(req, res) {
  console.log(`try to find: ${req.query.name}`);
  const regName = RegExp(req.query.name, 'i');
  await mongoDBRef
    .collection('questions')
    .find({ name: { $regex: regName } })
    .toArray((err, result) => {
      if (err || result[0] === undefined) {
        res
          .status(404)
          .json({ errors: ['The question failed to find by name.'] });
      } else {
        res.status(302).json({
          message: 'Successfully found question.',
          question: result,
        });
      }
    });
}

async function findQuestionByCategory(req, res) {
  console.log(`try to find: ${req.query.category}`);
  const regCategory = RegExp(req.query.category, 'i');
  await mongoDBRef
    .collection('questions')
    .find({ category: { $regex: regCategory } })
    .toArray((err, result) => {
      if (err || result[0] === undefined) {
        res
          .status(404)
          .json({ errors: ['The question failed to find by category.'] });
      } else {
        res.status(302).json({
          message: 'Successfully found question.',
          question: result,
        });
      }
    });
}

async function getCollection(collectionName, res) {
  console.log(`try to find: ${collectionName}`);

  await mongoDBRef
    .collection(collectionName)
    .find((err, result) => {
      if (err || !result) {
        res.status(404).json({ errors: ['Failed to find database.'] });
        return true;
      }
      res.status(302).json({
        message: 'Successfully found database.',
        question: result,
      });
      return false;
    });
}

async function deleteCollection(collectionName, res) {
  console.log(`try to find: ${collectionName}`);

  await mongoDBRef
    .collection('questions')
    .remove({}, (err, result) => {
      if (err || !result) {
        res.status(404).json({ errors: ['Failed to find database.'] });
        return true;
      }
      res.status(302).json({
        message: 'Successfully delete database.',
        question: result,
      });
      return false;
    });
}

// async function insertQuestion(req, res) {
//   try {
//     await mongoDBRef.collection('questions').save(
//       {
//         name: req.body.name,
//         category: req.body.category,
//         question: req.body.question,
//         created: Date.now()
//       },
//       function insertQuestionResult(err, result) {
//         if (err || !result) {
//           return res
//             .status(422)
//             .json({ errors: ['The question failed to save in database.'] });
//         }
//         return res.status(201).json({
//           message: 'Successfully saved question.',
//           question: result
//         });
//       }
//     );
//   } catch (e) {
//     return res.status(422).json({ errors: e.mapped() });
//   }
// }

// function getCollection(collectionName, callback) {}
module.exports.insertQuestion = insertQuestion;
module.exports.findQuestionByName = findQuestionByName;
module.exports.findQuestionByCategory = findQuestionByCategory;
module.exports.getCollection = getCollection;
module.exports.deleteCollection = deleteCollection;
