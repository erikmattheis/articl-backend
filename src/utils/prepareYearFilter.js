const { object } = require("joi");

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @returns {Object}
 */
const prepareYearFilter = (obj) => {
  if (obj.year && obj.yearComparison) {
    switch (obj.yearComparison) {
      case "after":
        obj.year = { $gte: obj.year };
      case "before":
        obj.year = { $lte: obj.year };
      case "exactly":
        obj.year = { $eq: obj.year };
    }
  }
  return obj;
};

module.exports = prepareYearFilter;
