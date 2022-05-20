const { object, string } = require("joi");
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

const regexFilter = (str) => {
  let regex = new RegExp(regexEscape(str), "i");
  return { $regex: regex };
};

const textFilter = (str) => {
  let regex = new RegExp(regexEscape(str), "i");
  return { $search: regex };
};

const stringToArrayFilter = (str, delim) => {
  if (Array.isArray(str)) {
    return str.slice();
  }
  if (!str || !delim) {
    return {};
  }
  return { $in: str.split(delim) };
};

module.exports = {
  yearFilter,
  textFilter,
  regexFilter,
  stringToArrayFilter,
};
