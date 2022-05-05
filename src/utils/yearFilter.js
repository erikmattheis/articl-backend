const { object } = require("joi");

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @returns {Object}
 */
const yearFilter = (obj) => {
  console.log("obj", obj);
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
  console.log("obj2", obj);
  return obj;
};

module.exports = {
  yearFilter,
};
