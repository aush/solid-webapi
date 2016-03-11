const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = () => [{
  method: 'post',
  auth: 'local',
  path: '/authenticate',
  handler: (req, res) => {
    res.json({ token: jwt.sign(null, config.secret, { subject: req.user.username }) });
  },
}];
