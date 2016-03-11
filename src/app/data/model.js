const _ = require('lodash');
const Schema = require('mongoose').Schema;

const name = 'Data';
const schema = new Schema({
  content: String,
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

module.exports = (connection) =>
  _.includes(connection.modelNames(), name)
    ? connection.model(name)
    : connection.model(name, schema);
