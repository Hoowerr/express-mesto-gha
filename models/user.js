const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { WEB_PATTERN } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => WEB_PATTERN.test(value),
      message: 'Wrong link format',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = async function findUser(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) throw new UnauthorizedError('Wrong email or password');
  if (!password) throw new Error('Password is required');
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new UnauthorizedError('Wrong email or password');
  return user;
};

module.exports = mongoose.model('user', userSchema);
