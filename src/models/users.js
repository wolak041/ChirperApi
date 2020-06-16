const mongose = require('mongoose');
const hashPassword = require('../services/hashPassword');

const UserSchema = new mongose.Schema(
  {
    nickname: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
      match: /^[a-zA-Z0-9_-]*$/,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: email => /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },
  },
  {
    versionKey: false,
  },
);

UserSchema.pre('save', async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongose.model('User', UserSchema);
