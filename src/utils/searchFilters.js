const { object } = require("joi");
const regexEscape = require("regex-escape");

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @returns {Object}
 */
const yearFilter = (obj) => {
  if (obj.year && obj.yearComparison) {
    switch (obj.yearComparison) {
      case "after":
        obj.year = { $gte: Number(obj.year) };
        break;
      case "before":
        obj.year = { $lte: Number(obj.year) };
        break;
      case "exactly":
        obj.year = { $eq: Number(obj.year) };
        break;
    }
  }
  delete obj.yearComparison;
  return obj;
};

const titleFilter = (obj) => {
  let regex = new RegExp(regexEscape(obj.title), "i");
  obj.title = { $regex: regex };
  return obj;
};

const regexFilter = (obj, name) => {
  let regex = new RegExp(regexEscape(obj[name]), "i");
  obj[name] = { $regex: regex };
  return obj;
};

module.exports = {
  yearFilter,
  titleFilter,
  regexFilter,
};
