/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const actions = require('./mocks/actions.mock');
const authenticationStrategy = require('./mocks/authentication-strategy.mock');
const authorizationStrategy = require('./mocks/authorization-strategy.mock');
const bootstrap = require('../../src/api/bootstrap');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('api-authenticate', () => {
  let close;

  beforeEach(function () {
    this.timeout(10000);
    return bootstrap(
      process.env.NODE_ENV,
      actions(),
      authenticationStrategy(),
      authorizationStrategy()
    ).then(c => { close = c; });
  });

  afterEach(() => close());

  it('should send a token if credentials is valid', () =>
    expect(axios
      .post(
        'http://localhost:8080/api/authenticate',
        { username: 'username1', password: 'password1' })
      .then(res => res.data))
        .to.eventually.have.property('token')
  );

  it('should not send a token if password is not valid', () =>
    expect(axios
      .post(
        'http://localhost:8080/api/authenticate',
        { username: 'username1', password: 'password' }))
          .to.eventually.be.rejected.and
          .to.eventually.have.property('status', 401)
  );

  it('should not send a token if username is not valid', () =>
    expect(axios
      .post(
        'http://localhost:8080/api/authenticate',
        { username: 'username', password: 'password1' }))
          .to.eventually.be.rejected.and
          .to.eventually.have.property('status', 401)
  );
});
