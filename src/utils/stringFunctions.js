const stringNearSubstring = function (str, subStr, len = 36) {
  if (!str || !subStr || !len) {
    return false;
  }
  if (str.length < len) {
    return str;
  }
  const position = str.toLowerCase().indexOf(subStr.toLowerCase());

  ("1234567801234567890123456789");
  if (position < Math.floor(len / 2)) {
    return `${str.substring(0, len - 3)}...`;
  }
  if (position + Math.ceil(len / 2) > str.length - 1) {
    return `...${str.substring(str.length - len)}`;
  }
  return `...${str.substring(
    position - Math.floor(len / 2),
    position + Math.ceil(len / 2)
  )}...`;
};

module.exports = {
  stringNearSubstring,
};
