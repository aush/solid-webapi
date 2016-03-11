/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const _ = require('lodash');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const apiConfig = require('./config');
const appConfig = require('../app/config');
const authFactory = require('./auth/auth-factory');
const routesFactory = require('./routes/routes-factory');
const server = require('./server');

mongoose.Promise = Promise;

let connectionToAppDb = undefined;
let connectionToApiDb = undefined;

const closeConnections = (connections) => {
  const connectionsToClose = [];
  /* eslint-disable prefer-const */
  for (let connection of connections) {
  /* eslint-enable prefer-const */
    if (connection && connection.readyState === 1) {
      connectionsToClose.push(connection);
    }
  }
  return Promise.all(_.map(connectionsToClose, c => c.close()));
};

module.exports = (
  env,
  actions,
  authenticationStrategy,
  authorizationStrategy
) => Promise.resolve()
  .then(() => {
    const connections = [];
    if (!actions) {
      connectionToAppDb = mongoose.createConnection();
      connections.push(() => connectionToAppDb.open(appConfig.db[env]));
    }
    if (!authenticationStrategy || !authorizationStrategy) {
      connectionToApiDb = mongoose.createConnection();
      connections.push(() => connectionToApiDb.open(apiConfig.db[env]));
    }
    return Promise.all(_.map(connections, c => c()));
  })
  .then(() => {
    const UserModelFactory = () => require('./auth/user')(connectionToApiDb);
    const auth = authFactory([
      authenticationStrategy || require('./auth/strategies/local')(UserModelFactory()),
      authorizationStrategy || require('./auth/strategies/jwt')(UserModelFactory()),
    ]);
    const authenticate = require('./auth/authenticate')(auth);

    const authRoutes = require('./routes/auth')();
    const dataRoutes = require('./routes/data')(actions || require('../app/data/actions')(connectionToAppDb));
    const routes = routesFactory(_.flatten([authRoutes, dataRoutes]), authenticate);

    return server(auth.initialize(), routes);
  })
  .then(close => () => Promise.all([
    close(),
    closeConnections([connectionToAppDb, connectionToApiDb]),
  ]))
  .catch(err => {
    console.log(`Error: ${err}`);
    return closeConnections([connectionToAppDb, connectionToApiDb]);
  });
