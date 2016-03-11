/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('../../../src/app/config');

chai.use(chaiAsPromised);

mongoose.Promise = Promise;

const expect = chai.expect;

describe('data', () => {
  let connection;
  let actions;

  beforeEach(() => {
    connection = mongoose.createConnection();
    return connection
      .open(config.db.test)
      .then(() => connection.db.dropDatabase())
      .then(() => { actions = require('../../../src/app/data/actions')(connection); })
      .catch(err => { console.log(err); return connection.close(); });
  });

  afterEach(() => connection.close());

  describe('writing data', () => {
    it('should add data', () =>
      expect(actions
        .addData({ content: 'haha' })
        .then(() => actions.getData()))
          .to.eventually.have.length(1)
    );
  });

  describe('reading data', () => {
    beforeEach(() =>
      Promise.all([
        actions.addData({ content: 'content' }),
        actions.addData({ content: 'more content' }),
      ]));

    it('should get some data', () =>
      expect(actions
        .getData({ content: 'content' }))
          .to.eventually.have.length(1).and
          .to.eventually.eql([{ content: 'content' }])
    );

    it('should get all data', () =>
      expect(actions
        .getData())
          .to.eventually.have.length(2).and
          .to.eventually.eql([{ content: 'content' }, { content: 'more content' }])
    );
  });
});
