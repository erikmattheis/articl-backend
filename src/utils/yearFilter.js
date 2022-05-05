const { object } = require("joi");

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @returns {Object}
 */
const yearFilter = (obj) => {
  if (obj.year && obj.yearComparison) {
    switch (obj.yearComparison) {
      case "after":
        obj.year = { $gte: Number(obj.year };
      case "before":
        obj.yearNumber = { $lte: obj.year };
      case "exactly":
        obj.year = { $eq: obj.year };
    }
  }
  return obj;
};

module.exports = {
  yearFilter,
};
