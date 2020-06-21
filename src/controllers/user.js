const jwt = require('jsonwebtoken');
const UserSchema = require('../models/users');
const { JWT_SECRET, JWT_EXPIRATION_TIME } = require('../../config');

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

const createToken = userId =>
  jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });

const createUser = async (req, res) => {
  const { nickname, email, password } = req.body;

  try {
    const user = new UserSchema({ nickname, email });
    await UserSchema.register(user, password);

    const token = createToken(user._id);

    res.send({
      message: 'User created',
      user: {
        _id: user._id,
        nickname: user.nickname,
      },
      token,
    });
  } catch (err) {
    res.status(400).send({ error: 'Cannot create user' });
  }
};

const loginUser = (req, res) => {
  const { user } = req;
  const token = createToken(user._id);

  res.send({
    message: 'Login successful',
    user: {
      _id: user._id,
      nickname: user.nickname,
    },
    token,
  });
};

const logoutUser = (req, res) =>
  req.session.destroy(err => {
    err
      ? res.status(500).send({ error: 'Unable to logout' })
      : res.send({ message: 'Logout successful' });
  });

const getLoggedUser = (req, res) => {
  const { _id, nickname } = req.user;

  res.send({
    message: 'User found',
    user: {
      _id,
      nickname,
    },
  });
};

const changeEmail = async (req, res) => {
  const { _id } = req.user;
  const { newEmail } = req.body;

  try {
    const user = await UserSchema.findByIdAndUpdate(
      _id,
      {
        email: newEmail,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select('_id nickname');

    res.send({
      message: 'Email changed',
      user,
    });
  } catch (err) {
    res.status(400).send({ error: 'Cannot change email' });
  }
};

const changePassword = async (req, res) => {
  const { user } = req;
  const { oldPassword, newPassword } = req.body;

  try {
    const { _id, nickname } = await user.changePassword(oldPassword, newPassword);

    res.send({
      message: 'Password changed',
      user: {
        _id,
        nickname,
      },
    });
  } catch (err) {
    res.status(400).send({ error: 'Cannot change password' });
  }
};

module.exports = {
  isNicknameAvailable,
  isEmailAvailable,
  createUser,
  loginUser,
  logoutUser,
  getLoggedUser,
  changeEmail,
  changePassword,
};
