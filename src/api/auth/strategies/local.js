const passportLocal = require('passport-local');
const Promise = require('bluebird');

module.exports = (UserModel) =>
  new passportLocal.Strategy(
    { session: false },
    (username, password, done) => {
      Promise.coroutine(function *() {
        try {
          const user = yield UserModel.findOne({ username }).exec();
          done(null, user && (yield user.comparePassword(password)) && user.toObject());
        } catch (err) {
          done(err);
        }
      })();
    }
  );
