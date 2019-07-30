class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 422;
    this.message = message;
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        name: this.name,
        stacktrace: this.stack,
        status: this.status
      }
    };
  }
}

module.exports.ValidationError = ValidationError;

/*
function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message;
  this.status = 422;
  Error.captureStackTrace(this, ValidationError);
}

ValidationError.create = options => {
  let err = null;

  if (options instanceof Error) {
    err = new ValidationError(options.message);
    err.stack = options.stack;
  } else if (typeof options === 'string') {
    err = new ValidationError(options);
  } else {
    const newError = new ValidationError(options.message || options.errmsg || options.$err || 'n/a');
    // Other options
    err = { ...newError, ...options };
  }

  return err;
};

ValidationError.prototype = new Error();

module.exports.ValidationError = ValidationError;
*/
