const cache = {};

exports.getValue = async key => {
  try {
    return await cache[key];
  } catch (error) {
    throw error;
  }
};

exports.setValue = async (key, value) => {
  try {
    cache[key] = value;
    return;
  } catch (error) {
    throw error;
  }
};
