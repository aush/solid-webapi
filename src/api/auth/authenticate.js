module.exports = passport => strategyName => passport.authenticate(strategyName, { session: false });
