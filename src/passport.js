const passport = require('passport');
const passportJWT = require('passport-jwt');
const { JWT_SECRET } = require('../config');

const UserSchema = require('./models/users');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const verifyUser = async (payload, done) => {
  try {
    const user = await UserSchema.findById(payload._id);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

const passportConfig = () => {
  const config = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  };

  passport.use(UserSchema.createStrategy());
  passport.use(new JWTStrategy(config, verifyUser));
};

module.exports = {
  passportConfig,
};
