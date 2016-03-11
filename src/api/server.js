/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const bodyParser = require('body-parser');
const express = require('express');
const Promise = require('bluebird');
const http = require('http');

let server = undefined;

module.exports = (auth, routes) => {
  const port = process.env.PORT;

  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(auth);

  app.use('/api', routes);

  server = http.createServer(app);

  return Promise.promisify(server.listen, { context: server })(port)
    .then(() => {
      console.log(`Listening at port:${port}`);
      return Promise.promisify(server.close, { context: server });
    });
};
