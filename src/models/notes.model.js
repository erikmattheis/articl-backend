const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const notesSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    oldCategory: {
        type: String,
        required: false,
        trim: true
    },
    oldId: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "Published",
      index: true,
    },
    fullText: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notesSchema.set("toJSON", {
  virtuals: true,
});

notesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// add plugin that converts mongoose to json
notesSchema.plugin(toJSON);
notesSchema.plugin(paginate);

/**
 * @typedef Notes
 */
const Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;
