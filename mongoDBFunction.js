const mongoose = require('mongoose');
const paginate = require('express-paginate');
const config = require('./config.js');

mongoose.Promise = Promise;
mongoose.set('debug', true);

//  local
//  const url = 'mongodb://127.0.0.1:27017/myTest';

const {
  db: { host, name, account, password, other }
} = config;
const url = `mongodb+srv://${account}:${password}@${host}/${name}?${other}`;

mongoose.connect(url, {
  useNewUrlParser: true,
  config: { autoIndex: true }
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const questionSchema = new mongoose.Schema({
  author: String,
  //  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  category: [
    {
      term_id: Number,
      description: String,
      parent: Number,
      title: { type: String, index: true },
      category_image: String
    }
  ],
  updated: String,
  createTime: String,
  question: String,
  answers: [
    {
      answer: String,
      correct: Boolean,
      explanation: String
    }
  ]
});
// questionSchema.index({ '$**': 'text' });

questionSchema.index({
  category: 'text',
  question: 'text',
  'answers.answer': 'text',
  'answers.explanation': 'text'
});

const Question = mongoose.model('Question', questionSchema);

const categorySchema = new mongoose.Schema({
  term_id: Number,
  description: String,
  parent: Number,
  title: { type: String, index: true },
  category_image: String
});

const Category = mongoose.model('Category', categorySchema);

async function insertQuestion(req, res) {
  // console.log(`dubug:${newQuestion}`);
  try {
    const category = await Category.find({ title: req.body.category });
    const newQuestion = new Question({
      author: req.body.author,
      // //  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
      category,
      updated: new Date(),
      createTime: new Date(),
      question: req.body.question,
      answers: req.body.answers
    });
    await newQuestion.save((err, result) => {
      if (err) {
        res.status(500).json({ errors: err.mapped() });
      } else {
        res.status(201).json({
          message: 'Successfully insert question.',
          question: result
        });
      }
    });
  } catch (e) {
    res.status(422).json({ errors: e.mapped() });
  }
}

async function findQuestionByAuthor(req, res) {
  console.log(`try to find: ${req.query.author}`);
  const regAuthor = RegExp(req.query.author, 'i');
  try {
    await Question.find({ author: { $regex: regAuthor } }, (err, result) => {
      if (err) {
        res.status(500).json({ errors: err.mapped() });
      } else {
        res.status(200).json({
          message: 'Successfully found question.',
          question: result
        });
      }
    });
  } catch (e) {
    res.status(422).json({ errors: e.mapped() });
  }
}

async function findQuestionByCategory(req, res) {
  console.log(`try to find: ${req.query.category}`);
  const regCategory = RegExp(req.query.category, 'i');
  try {
    await Question.find({ category: { $regex: regCategory } }, (err, result) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        res.status(200).json({
          message: 'success',
          question: result
        });
      }
    });
  } catch (e) {
    res.status(500).json({ e });
  }
}
async function findQuestionById(req, res) {
  try {
    await Question.find({ _id: req.params.id }, (err, result) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        res.status(200).json({
          message: 'success',
          question: result
        });
      }
    });
  } catch (e) {
    res.status(500).json({ e });
  }
}

async function findAnswersById(req, res) {
  try {
    const results = await Question.find({ _id: req.params.id }).select('question');
    console.log(results[0].question.answers);
    if (req.accepts('json')) {
      res.status(200).json({
        message: 'Successfully found answers by ID.',
        answers: results[0].question.answers
      });
    }
  } catch (e) {
    res.status(500).json({ e });
  }
}

//  http://localhost:3000/questions?page=1&limit=2&sort=name
//  http://localhost:3000/questions?page=1&limit=2&sort=createTime&order=1

async function getQuestions(req, res) {
  console.log('try to find all questions, sort by:', req.query.sort);
  try {
    const [results, itemCount] = await Promise.all([
      //  Question.find({}).limit(req.query.limit).skip(req.skip).sort({ updated: req.query.order })
      Question.find({})
        .limit(req.query.limit)
        .skip(req.skip)
        .sort(req.query.sort)
        .lean()
        .exec(),
      Question.count({})
    ]);
    console.log(results);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    if (req.accepts('json')) {
      res.status(200).json({
        message: 'Successfully found database.',
        has_more: paginate.hasNextPages(req)(pageCount),
        question: results
      });
    }
  } catch (e) {
    res.status(500).json({ e });
  }
}

async function deleteQuestion(res) {
  console.log('try to delete all items in Question');
  try {
    await Question.remove({}, (err, result) => {
      if (err || !result) {
        res.status(500).json({ errors: err.mapped() });
      }
      res.status(200).json({
        message: 'Successfully delete database.',
        question: result
      });
    });
  } catch (e) {
    res.status(500).json({ e });
  }
}

async function deleteQuestionById(req, res) {
  console.log('try to delete a Question');
  try {
    await Question.remove({ _id: req.params.id }, (err, result) => {
      if (err || !result) {
        res.status(500).json({ errors: ['Failed to delete this question.'] });
        return true;
      }
      res.status(200).json({
        message: 'Successfully delete database.',
        question: result
      });
      return false;
    });
  } catch (e) {
    res.status(500).json({ e });
  }
}

async function updateQuestionById(req, res) {
  try {
    const updateItems = req.body;
    updateItems.updated = new Date();
    await Question.updateOne({ _id: req.query.id }, updateItems, (err, result) => {
      if (err) {
        res.status(500).json({ errors: err.mapped() });
      } else {
        res.status(201).json({
          message: 'Successfully insert question.',
          question: result
        });
      }
    });
  } catch (e) {
    res.status(500).json({ e });
  }
}

async function getCategories(res) {
  console.log('try to find all categories');
  try {
    await Category.find((err, result) => {
      if (err || !result) {
        console.log('error in getCategories', err);
        res.status(404).json({ errors: ['Failed to find database.'] });
        return true;
      }
      res.status(200).json({
        message: 'Successfully found database.',
        question: result
      });
      return false;
    });
  } catch (e) {
    res.status(500).json({ e });
  }
}

async function getAllCategories() {
  console.log('try to find all categories');
  try {
    const categories = await Category.find((err, result) => {
      if (err || !result) {
        return false;
      }
      return result;
    });
    return categories;
  } catch (e) {
    // need change
    console.log('something wrong in getAllCategories');
  }
}

async function getCategoryNames() {
  console.log('getCategoryNames');
  try {
    const result = await Category.find()
      // .select('title')
      .sort('title')
      .exec();
    console.log('result', result);
    return result;
  } catch (error) {
    console.log('getCategoryNames error', error);
    return Error(error);
  }
}

/*
async function getAllCategories() {
  console.log('try to find all categories');
  try {
    return Category
      .find({});
  } catch (e) {
    throw new Error(e);
  }
}
*/

async function findQuestionAllMeeting(req, res) {
  console.log(`try to find: ${req.query.find}`);
  // const regFind = RegExp(req.query.find, 'i');
  try {
    const results = await Question
      // .find({
      //   $or: [{ category: { $regex: regFind } },
      //     { 'question.question': { $regex: regFind } },
      //     { 'question.answers.answer': { $regex: regFind } },
      //     { 'question.answers.explanation': { $regex: regFind } }],
      // });
      .find({
        $text: { $search: req.query.find }
      });
    if (req.accepts('json')) {
      res.status(200).json({
        message: 'Successfully found database.',
        question: results
      });
    }
  } catch (e) {
    res.status(500).json({ e });
  }
}

// function getCollection(collectionName, callback) {}
module.exports.insertQuestion = insertQuestion;
module.exports.findQuestionByAuthor = findQuestionByAuthor;
module.exports.findQuestionByCategory = findQuestionByCategory;
module.exports.findQuestionById = findQuestionById;
module.exports.updateQuestionById = updateQuestionById;
module.exports.getQuestions = getQuestions;
module.exports.deleteQuestion = deleteQuestion;
module.exports.deleteQuestionById = deleteQuestionById;
module.exports.getCategories = getCategories;
module.exports.getCategoryNames = getCategoryNames;
module.exports.getAllCategories = getAllCategories;
module.exports.findAnswersById = findAnswersById;
module.exports.findQuestionAllMeeting = findQuestionAllMeeting;
