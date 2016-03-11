const _ = require('lodash');
const bluebird = require('bluebird');
const Schema = require('mongoose').Schema;

const bcrypt = bluebird.promisifyAll(require('bcryptjs'));

const name = 'User';
const schema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
}, {
  toObject: {
    transform: (doc, ret) => {
      /* eslint-disable no-param-reassign */
      delete ret.__v;
      delete ret._id;
      /* eslint-enable no-param-reassign */
    },
  },
});

schema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    bcrypt.genSaltAsync(10)
      .then(salt => bcrypt.hashAsync(user.password, salt))
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

schema.methods.comparePassword = function (password) {
  const user = this;
  return bcrypt.compareAsync(password, user.password);
};

module.exports = (connection) =>
  _.includes(connection.modelNames(), name)
    ? connection.model(name)
    : connection.model(name, schema);
