const mongose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

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
      lowercase: true,
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
    timestamps: true,
  },
);

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  hashField: 'password',
});

module.exports = mongose.model('User', UserSchema);
