const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    nameFirst: {
      type: String,
      required: true,
      trim: true,
    },
    nameLast: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    position: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: false,
    },
    education: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: false,
    },
    institution: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: false,
    },
    city: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: false,
    },
    state: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: false,
    },
    country: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: false,
    },
    theme: {
      type: String,
      required: false,
      unique: false,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/[0-9]/) || !value.match(/[a-z]/) || !value.match(/[A-Z]/) || value.length < 8 || value.length > 64) {
          throw new Error(
            "Password must be between 8 and 64 characters long and contain at least one uppercase letter, one lowercase letter and a digit."
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      required: true,
      enum: roles,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    oldUserId: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**ed 
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
