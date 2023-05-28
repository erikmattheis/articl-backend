const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");

const categoriesSchema = mongoose.Schema(
  {
    oldId: {
      type: Number,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleHtml: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    parent: {
      type: Number,
      required: false,
      trim: true,
    },
    aiDescription: {  
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    oldParentId: {
      type: Number,
      required: false,
      trim: true,
    },
    parentSlug: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      trim: true,
      default: 0,
    },
    user: {
       type: mongoose.SchemaTypes.ObjectId,
       required: true
    },
    wpArticlsImported: {
      type: Boolean,
      default: false,
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
categoriesSchema.statics.isCategorySlug = async function (val, excludeId) {
  const category = await this.findOne({ slug: val, _id: { $ne: excludeId } });
  return !!category;
};

/**
 * @param {val} String
 * @returns {Promise<boolean>}
 */
categoriesSchema.methods.getCategoriesByParentSlug = async function (
  parentSlug
) {
  const categories = await this.find({ parentSlug });
  return categories;
};

/**
 * @typedef Category
 */
const Category = mongoose.model("Category", categoriesSchema);

module.exports = Category;
