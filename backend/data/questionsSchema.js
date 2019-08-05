const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  answers: [
    {
      answer: String,
      correct: Boolean,
      explanation: String
    }
  ],
  //  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  author: String,
  category: [
    {
      category_image: String,
      description: String,
      parent: Number,
      term_id: Number,
      title: { index: true, type: String }
    }
  ],
  createTime: Date,
  question: String,
  updated: Date
});

questionSchema.index({
  'answers.answer': 'text',
  'answers.explanation': 'text',
  category: 'text',
  question: 'text'
});

exports.Question = mongoose.model('Question', questionSchema);
