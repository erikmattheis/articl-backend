const paginate = require('express-paginate');
const { Question } = require('./questionsSchema');

async function postQuestion(req) {
  const question = new Question({
    answers: req.body.answers,
    author: req.body.author,
    category: {
      category_image: '',
      description: 'desc',
      parent: 0,
      term_id: 1,
      title: 'My Title'
    },
    createTime: new Date(),
    question: req.body.question,
    updated: new Date()
  });

  try {
    const result = await question.save();
    return result;
  } catch (error) {
    throw error;
  }
}
exports.postQuestion = postQuestion;

async function getQuestions(req) {
  req.query.sort = req.query.sort ? req.query.sort : 'updated';
  try {
    const opts = req.params.id ? { _id: req.params.id } : {};
    const [results, itemCount] = await Promise.all([
      Question.find(opts)
        .limit(req.query.limit)
        .skip(req.skip)
        .sort(req.query.sort)
        .lean()
        .exec(),
      Question.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);

    return {
      has_more: paginate.hasNextPages(req)(pageCount),
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.getQuestions = getQuestions;

async function deleteQuestions() {
  try {
    if (process.env.NODE_ENV !== 'development') {
      const error = await new Error(
        'deleteQuestion may only be used in development! To start the app in development mode, run gulp.'
      );
      return error;
    }
    return 'Successfully deleted questions!';
    /*

    await Question.remove({}, (err, result) => {
      if (err || !result) {
        res.status(500).json({
          errors: err.mapped()
        });
      }
      res.status(200).json({
        message: 'Successfully delete database.',
        question: result
      });
    });
    */
  } catch (error) {
    throw error;
  }
}
exports.deleteQuestions = deleteQuestions;

/*
async function findQuestionByAuthor(req, res) {
  console.log(`try to find: ${req.query.author}`);
  const regAuthor = RegExp(req.query.author, 'i');
  try {
    await Question.find(
      {
        author: {
          $regex: regAuthor
        }
      },
      (err, result) => {
        if (err) {
          res.status(500).json({
            errors: err.mapped()
          });
        } else {
          res.status(200).json({
            message: 'Successfully found question.',
            question: result
          });
        }
      }
    );
  } catch (e) {
    res.status(422).json({
      errors: e.mapped()
    });
  }
}
*/

/*
async function findQuestionByCategory(req, res) {
  console.log(`try to find: ${req.query.category}`);
  const regCategory = RegExp(req.query.category, 'i');
  try {
    await Question.find(
      {
        category: {
          $regex: regCategory
        }
      },
      (err, result) => {
        if (err) {
          res.status(500).json({
            err
          });
        } else {
          res.status(200).json({
            message: 'success',
            question: result
          });
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      e
    });
  }
}
*/
/*
async function findAnswersById(req, res) {
  try {
    const results = await Question.find({
      _id: req.params.id
    }).select('question');
    console.log(results[0].question.answers);
    if (req.accepts('json')) {
      res.status(200).json({
        answers: results[0].question.answers,
        message: 'Successfully found answers by ID.'
      });
    }
  } catch (e) {
    res.status(500).json({
      e
    });
  }
}
*/

/*
async function deleteQuestionById(req, res) {
  console.log('try to delete a Question');
  try {
    await Question.remove(
      {
        _id: req.params.id
      },
      (err, result) => {
        if (err || !result) {
          res.status(500).json({
            errors: ['Failed to delete this question.']
          });
          return true;
        }
        res.status(200).json({
          message: 'Successfully delete database.',
          question: result
        });
        return false;
      }
    );
  } catch (e) {
    res.status(500).json({
      e
    });
  }
}
*/

/*
async function updateQuestionById(req, res) {
  try {
    const updateItems = req.body;
    updateItems.updated = new Date();
    await Question.updateOne(
      {
        _id: req.query.id
      },
      updateItems,
      (err, result) => {
        if (err) {
          res.status(500).json({
            errors: err.mapped()
          });
        } else {
          res.status(201).json({
            message: 'Successfully insert question.',
            question: result
          });
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      e
    });
  }
}
*/

/*
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
        $text: {
          $search: req.query.find
        }
      });
    if (req.accepts('json')) {
      res.status(200).json({
        message: 'Successfully found database.',
        question: results
      });
    }
  } catch (e) {
    res.status(500).json({
      e
    });
  }
}
*/

/*
module.exports.findQuestionByAuthor = findQuestionByAuthor;
module.exports.findQuestionById = findQuestionById;
module.exports.updateQuestionById = updateQuestionById;
module.exports.deleteQuestion = deleteQuestion;
module.exports.deleteQuestionById = deleteQuestionById;
module.exports.findAnswersById = findAnswersById;
module.exports.findQuestionAllMeeting = findQuestionAllMeeting;
*/
