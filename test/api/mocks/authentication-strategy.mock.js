const passportLocal = require('passport-local');

module.exports = () => new passportLocal.Strategy(
  { session: false },
  (username, password, done) => {
    const user = {
      username: 'username1',
      password: 'password1',
    };

    done(null, username === user.username && password === user.password && user);
  }
);
