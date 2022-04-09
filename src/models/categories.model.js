const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const categoriesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    desc: {
      type: String,
      required: false,
      trim: true,
    },
    parentSlug: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
categoriesSchema.plugin(toJSON);
categoriesSchema.plugin(paginate);

/**
category slug * @param {string} val
 * @returns {Promise<boolean>}
 */
categoriesSchema.statics.isCategorySlug = async function (val) {
  const category = await this.findOne({ slug: val });
  return !!category;
};

/**
 * Check if password matches the category's password
 * @param {val} ObjectId
 * @returns {Promise<boolean>}
 */
categoriesSchema.methods.getCategoriesByparentSlug = async function (val) {
  const categories = await this.find({ parentSlug: val });
  return categories;
};

categoriesSchema.pre('save', async function (next) {
  const category = this;
  if (category.isModified('password')) {
    category.password = await bcrypt.hash(category.password, 8);
  }
  next();
});

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categoriesSchema);

module.exports = Category;
