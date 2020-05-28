const bcrypt = require('bcrypt');
const UserSchema = require('../models/users');

const handleAvailabilityCheck = async (value, res) => {
  try {
    const isAvailable = !(await UserSchema.findOne(value));
    res.send({ isAvailable });
  } catch (err) {
    res.status(400).send({
      error: 'Request invalid',
    });
  }
};

const isNicknameAvailable = async (req, res) => {
  const { nickname } = req.body;
  handleAvailabilityCheck({ nickname }, res);
};
const isEmailAvailable = async (req, res) => {
  const { email } = req.body;
  handleAvailabilityCheck({ email }, res);
};

const createUser = async (req, res) => {
  const newUser = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
  };

  console.log(newUser);
  try {
    const user = await UserSchema.create(newUser);

    req.session.user = { id: user._id };
    res.send({
      message: 'User created',
      user: {
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(400).send({ error: 'Cannot create user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email }).select('nickname email password');
    const match = user && (await bcrypt.compare(password, user.password));

    if (match) {
      req.session.user = { id: user._id };
      res.send({
        message: 'Login successful',
        user: {
          nickname: user.nickname,
          email: user.email,
        },
      });
    } else {
      res.status(401).send({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(400).send({ error: 'Request invalid' });
  }
};

const logoutUser = (req, res) =>
  req.session.destroy((err) => {
    err
      ? res.status(500).send({ error: 'Unable to logout' })
      : res.send({ message: 'Logout successful' });
  });

const checkSession = (req, res, next) =>
  req.session.user ? next() : res.status(401).send({ error: 'No user session' });

const getUser = async (req, res) => {
  const userId = req.session.user._id;

  try {
    const user = await UserSchema.findOne(userId).select('-_id -password');

    res.send({ message: 'User found', user });
  } catch (err) {
    res.status(500).send({ error: 'Cannot get user' });
  }
};

module.exports = {
  isNicknameAvailable,
  isEmailAvailable,
  createUser,
  loginUser,
  logoutUser,
  checkSession,
  getUser,
};
