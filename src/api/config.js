module.exports = {
  secret: 'secret',
  db: {
    production: 'mongodb://user:pass@example.com:1234/api',
    development: 'mongodb://localhost:27017/api-dev',
    test: 'mongodb://localhost:27017/api-test',
  },
};
