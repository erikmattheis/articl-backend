const express = require("express");
const authRoute = require("./auth.route");
const articlsRoute = require("./articls.route");
const userRoute = require("./user.route");
const categoriesRoute = require("./categories.route");
const importsRoute = require("./imports.route");
const resources = require("./resources.route");
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
    route: resources,
  },
  {
    path: "/categories",
    route: categoriesRoute,
  },
  {
    path: "/imports",
    route: importsRoute,
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
  {
    path: "/imports",
    route: importsRoute,
  },
];

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
