const _ = require('lodash');

module.exports = (connection) => {
  const DataModel = require('./model')(connection);

  return {
    getData:
      (data) => DataModel.find(data || {}).exec().then(results => _.map(results, r => r.toObject())),
    addData:
      (data) => new DataModel(data).save(),
    deleteData:
      (data) => DataModel.find(data || {}).remove().exec(),
  };
};
