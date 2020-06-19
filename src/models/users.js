const mongose = require('mongoose');
const validator = require('validator');
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
      validate: validator.isEmail,
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
