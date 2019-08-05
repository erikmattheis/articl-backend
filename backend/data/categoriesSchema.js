const mongoose = require('mongoose');

mongoose.promise = Promise;

const categorySchema = new mongoose.Schema({
  category_image: String,
  description: String,
  parent: { index: true, type: Number },
  term_id: Number,
  title: { index: true, type: String }
});

exports.Category = mongoose.model('Category', categorySchema);
