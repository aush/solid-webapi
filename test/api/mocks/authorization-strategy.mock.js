const passportJwt = require('passport-jwt');

module.exports = () => new passportJwt.Strategy(
  {
    secretOrKey: 'secret',
    jwtFromRequest: passportJwt.ExtractJwt.fromBodyField('token'),
  },
  (jwtPayload, done) => {
    const user = {
      username: 'username1',
    };

    done(null, jwtPayload.sub === user.username && user);
  }
);
