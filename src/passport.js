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

const cookieExtractor = req => {
  const { refreshToken } = req.cookies;
  return refreshToken;
};

const passportConfig = () => {
  passport.use(UserSchema.createStrategy());
  passport.use(
    'accessToken',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      verifyUser,
    ),
  );
  passport.use(
    'refreshToken',
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: JWT_SECRET,
      },
      verifyUser,
    ),
  );
};

module.exports = {
  passportConfig,
};
