/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const _ = require('lodash');
const Promise = require('bluebird');

const db = [
  { content: 'content' },
  { content: 'more content' },
];

module.exports = () => ({
  getData:
    (data) => {
      if (data) {
        return Promise.resolve(_.find(db, item => item.content === data.content));
      }
      return Promise.resolve(db);
    },
  addData:
    (data) => {
      db.push(data);
      return Promise.resolve();
    }
});
