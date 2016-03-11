/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const express = require('express');

module.exports = (routes, authenticate) => {
  const router = express.Router();

  /* eslint-disable prefer-const */
  for (let route of routes) {
  /* eslint-enable prefer-const */
    if (route.auth) {
      router[route.method](route.path, authenticate(route.auth), route.handler);
    } else {
      router[route.method](route.path, route.handler);
    }
  }

  return router;
};
