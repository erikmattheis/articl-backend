/**
 * Creates a new ValidationError
 * @class
 * @augments Error
 * @param {string} message The error message
 * @return {ValidationError} A ValidationError instance
 */
function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message;
  Error.captureStackTrace(this, ValidationError);
}

/**
 * Creates a new ValidationError object
 * @method
 * @param {object} options The error options
 * @return {ValidationError} A ValidationError instance
 */
ValidationError.create = function (options) {
  var err = null;

  if (options instanceof Error) {
    err = new ValidationError(options.message);
    err.stack = options.stack;
  } else if (typeof options == 'string') {
    err = new ValidationError(options);
  } else {
    err = new ValidationError(options.message || options.errmsg || options.$err || "n/a");
    // Other options
    for (var name in options) {
      err[name] = options[name];
    }
  }

  return err;
}

// Extend JavaScript error
ValidationError.prototype = new Error;

module.exports = ValidationError;
