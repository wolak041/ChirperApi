const bcrypt = require('bcrypt');
const UserSchema = require('../models/users');
const hashPassword = require('../services/hashPassword');

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

  try {
    const user = await UserSchema.create(newUser);

    req.session.user = { id: user._id };
    res.send({
      message: 'User created',
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).send({ error: 'Cannot create user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email }).select('nickname email password _id');
    const match = user && (await bcrypt.compare(password, user.password));

    if (match) {
      req.session.user = { id: user._id };
      res.send({
        message: 'Login successful',
        user: {
          id: user._id,
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
  req.session.destroy(err => {
    err
      ? res.status(500).send({ error: 'Unable to logout' })
      : res.send({ message: 'Logout successful' });
  });

const checkSession = (req, res, next) =>
  req.session.user ? next() : res.status(401).send({ error: 'No user session' });

const getLoggedUser = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const user = await UserSchema.findById(userId);

    res.send({
      message: 'User found',
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).send({ error: 'Cannot get user' });
  }
};

//TODO: Ask for current password
const changeEmail = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const user = await UserSchema.findByIdAndUpdate(
      userId,
      { email: req.body.newEmail },
      {
        new: true,
        runValidators: true,
      },
    );

    res.send({
      message: 'Email changed',
      user,
    });
  } catch (err) {
    res.status(500).send({ error: 'Cannot change email' });
  }
};

//TODO: Ask for current password
const changePassword = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const newPassword = await hashPassword(req.body.newPassword);
    const user = await UserSchema.findByIdAndUpdate(
      userId,
      { password: newPassword },
      {
        new: true,
        runValidators: true,
      },
    );

    res.send({
      message: 'Password changed',
      user,
    });
  } catch (err) {
    res.status(500).send({ error: 'Cannot change password' });
  }
};

module.exports = {
  isNicknameAvailable,
  isEmailAvailable,
  createUser,
  loginUser,
  logoutUser,
  checkSession,
  getLoggedUser,
  changeEmail,
  changePassword,
};
