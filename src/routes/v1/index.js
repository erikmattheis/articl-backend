const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoriesRoute = require('./categories.route');
const articlPages = require('./articlPages.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/d',
    route: articlPages,
  },
  {
    path: '/categories',
    route: categoriesRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
