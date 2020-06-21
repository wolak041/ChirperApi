const passport = require('passport');

const localCheck = (req, res, next) =>
  passport.authenticate('local', {
    session: false,
    failWithError: true,
  })(req, res, next);

const jwtCheck = (req, res, next) =>
  passport.authenticate('jwt', {
    session: false,
    failWithError: true,
  })(req, res, next);

module.exports = {
  localCheck,
  jwtCheck,
};
