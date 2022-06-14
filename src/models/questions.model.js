const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const questionSchema = new mongoose.Schema(
  {
    answers: [
      {
        answer: String,
        correct: Boolean,
        explanation: String,
      },
    ],
    author: String,
    slug: String,
    question: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

/**
 * @typedef Questions
 */
const Questions = mongoose.model("Questions", questionSchema);

module.exports = Questions;
