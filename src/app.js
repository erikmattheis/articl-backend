const express = require("express");
const helmet = require("helmet-csp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

if (config.env !== "test") {

  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);

}

// set security HTTP headers
app.use(helmet());

/*

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'","https://www.google-analytics.com/analytics.js"],
  },
  reportOnly: false,
}));

*/
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

var whitelist = process.env.FRONTEND_URL;

if (whitelist.indexOf(",") > -1) {
  whitelist = whitelist.split(",");
} else {
  whitelist = [whitelist];
}

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// enable cors
app.use(cors(corsOptions));
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
app.use("/v1/auth", authLimiter);

// v1 api routes
app.use("/v1", routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// send back a 404 error for any unknown api request

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "No route found."));
});

module.exports = app;
