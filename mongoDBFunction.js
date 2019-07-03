/* eslint-disable no-console */
const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/myTest';
mongoose.connect(url, {
  useNewUrlParser: true,
  config: { autoIndex: false },
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('MongoDB in mongoose is active.');
});

const categorySchema = new mongoose.Schema({
  term_id: Number,
  name: String,
  slug: String,
  description: String,
  parent: Number,
  html_title: String,
  category_image: String,
}, {
  toJSON: { virtuals: true },
});
categorySchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});
const Category = mongoose.model('Category', categorySchema);

const questionSchema = new mongoose.Schema({
  author: String,
  name: String,
  //  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  category: String,
  updated: String,
  createTime: String,
  question: {
    question: String,
    answers: [
      {
        id: Number,
        answers: String,
        correct: Boolean,
        Explanation: String,
      },
    ],
  },
});

const Question = mongoose.model('Question', questionSchema);

async function insertQuestion(req, res) {
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth()
    + 1}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  const dateTime = `${date} ${time}`;

  const newQuestion = new Question({
    author: req.body.author,
    name: req.body.name,
    // //  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    category: req.body.category,
    updated: dateTime,
    createTime: dateTime,
    question: req.body.question,
  });
  // console.log(`dubug:${newQuestion}`);
  try {
    await newQuestion.save((err, result) => {
      if (err || !result) {
        res
          .status(404)
          .json({ errors: ['The question failed to save in database.'] });
      } else {
        res.status(201).json({
          message: 'Successfully saved question.',
          question: result,
        });
      }
    });
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
}


async function findQuestionByName(req, res) {
  console.log(`try to find: ${req.query.name}`);
  const regName = RegExp(req.query.name, 'i');
  try {
    await Question
      .find({ name: { $regex: regName } }, (err, result) => {
        if (err || result[0] === undefined) {
          res
            .status(404)
            .json({ errors: ['The question failed to find by name.'] });
        } else {
          res.status(200).json({
            message: 'Successfully found question.',
            question: result,
          });
        }
      });
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
}

async function findQuestionByCategory(req, res) {
  console.log(`try to find: ${req.query.category}`);
  const regCategory = RegExp(req.query.category, 'i');
  try {
    await Question
      .find({ category: { $regex: regCategory } }, (err, result) => {
        if (err || result[0] === undefined) {
          res
            .status(404)
            .json({ errors: ['The question failed to find by category.'] });
        } else {
          res.status(200).json({
            message: 'Successfully found question.',
            question: result,
          });
        }
      });
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
}

async function getCollection(collectionName, res) {
  console.log(`try to find: ${collectionName}`);
  try {
    await Question
      .find((err, result) => {
        if (err || !result) {
          res.status(404).json({ errors: ['Failed to find database.'] });
          return true;
        }
        res.status(200).json({
          message: 'Successfully found database.',
          question: result,
        });
        return false;
      });
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
}

async function deleteQuestion(res) {
  console.log('try to delete all items in Question');
  try {
    await Question
      .remove({}, (err, result) => {
        if (err || !result) {
          res.status(404).json({ errors: ['Failed to find database.'] });
          return true;
        }
        res.status(200).json({
          message: 'Successfully delete database.',
          question: result,
        });
        return false;
      });
  } catch (e) {
    return res.status(422).json({ errors: e.mapped() });
  }
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
module.exports.deleteQuestion = deleteQuestion;
