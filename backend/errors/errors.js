function ValidationError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.statusCode = 422;
  this.extra = extra;
}
module.exports.ValidationError = ValidationError;
require('util').inherits(module.exports.ValidationError, Error);

function FileNotFoundError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Resource not found.';
  this.statusCode = 404;
  this.extra = extra;
}
module.exports.FileNotFoundError = FileNotFoundError;
require('util').inherits(module.exports.FileNotFoundError, Error);

function DatabaseError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.statusCode = 500;
  this.extra = extra;
}
module.exports.DatabaseError = DatabaseError;
require('util').inherits(module.exports.DatabaseError, Error);
