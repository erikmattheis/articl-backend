const varValueConvert = require('cross-env/src/variable');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/) && value !== "me") {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

function password(value, helpers) {

  if (scoreChars(value) < 3) {

    helpers.message("Please choose a more complex password. Use a combination upper and lowercase letters, numbers and special characters.");


  } else if (value && value.length < 8) {

    helpers.message("Please choose a password. with at least eight characters");

    passed = false;

  }
  return value;
};

function charCounts(val) {

  return {
    numUpper: val.length - val.replace(/[A-Z]/g, "").length,
    numLower: val.length - val.replace(/[a-z]/g, "").length,
    numDigit: val.length - val.replace(/d/g, "").length,
    numSpecial: val.length - val.replace(/\W|_/g, "").length,
  };

};

function scoreChars(val) {

  if (!val) {

    return 0;

  }

  const chars = charCounts(val);
  const a = chars.numUpper > 0 ? 1 : 0;
  const b = chars.numLower > 0 ? 1 : 0;
  const c = chars.numDigit > 0 ? 1 : 0;
  const d = chars.numSpecial > 0 ? 1 : 0;

  return a + b + c + d;

}

module.exports = {
  objectId,
  password,
};
