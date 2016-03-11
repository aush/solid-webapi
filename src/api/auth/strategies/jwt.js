const config = require('../../config');
const passportJwt = require('passport-jwt');

module.exports = (UserModel) =>
  new passportJwt.Strategy(
    {
      secretOrKey: config.secret,
      jwtFromRequest: passportJwt.ExtractJwt.fromBodyField('token'),
    },
    (payload, done) => {
      UserModel.findOne({ username: payload.sub })
        .then(user => { done(null, user && user.toObject()); return null; })
        .catch(err => { done(err); return null; });
    }
  );
