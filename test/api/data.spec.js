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

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VybmFtZTEifQ.XvgRiI9VCar3mfKoNcfVWu9v-7it-CRr5uUUmjYcxAQ';

describe('api-data', () => {
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

  it('should get all data', () =>
    expect(axios
      .get('http://localhost:8080/api/data')
      .then(res => res.data))
        .to.eventually.eql([{ content: 'content' }, { content: 'more content' }])
  );

  it('should get some data', () =>
    expect(axios
      .get('http://localhost:8080/api/data/content')
      .then(res => res.data))
        .to.eventually.eql({ content: 'content' })
  );

  it('should add data', () =>
    expect(axios
      .post('http://localhost:8080/api/data/content2', { token })
      .then(res => res.status))
        .to.eventually.eql(200)
  );
});
