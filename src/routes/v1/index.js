const express = require("express");
const authRoute = require("./auth.route");
const articlsRoute = require("./articls.route");
const userRoute = require("./user.route");
const categoriesRoute = require("./categories.route");
const articlPages = require("./articlPages.route");
const docsRoute = require("./docs.route");
const notesRoute = require("./notes.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/articls",
    route: articlsRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/resource",
    route: articlPages,
  },
  {
    path: "/categories",
    route: categoriesRoute,
  },
  {
    path: "/notes",
    route: notesRoute,
  },

];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
