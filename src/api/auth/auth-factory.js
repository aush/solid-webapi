/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const passport = require('passport');

module.exports = (strategies) => {
  /* eslint-disable prefer-const */
  for (let strategy of strategies) {
  /* eslint-enable prefer-const */
    passport.use(strategy.name, strategy);
  }

  return passport;
};
