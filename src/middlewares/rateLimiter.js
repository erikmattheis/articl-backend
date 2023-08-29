const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
};
