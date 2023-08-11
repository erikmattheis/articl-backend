const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const notesSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
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
    fullText: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    authorHandle: {
      type: String,
      required: false,
      trim: true,
    },
    wpNote: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    }
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
