const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;
const { CREATED_CODE } = require('../utils/constants');
const User = require('../models/user');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_KEY : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });
      res.send({ message: 'You have successfully logged in!' });
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, id, next) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;
  getUserById(req, res, id, next);
};

module.exports.getUser = (req, res, next) => {
  const id = req.params.userId;
  getUserById(req, res, id, next);
};

const updateInfo = (req, res, dataToUpdate, next) => {
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    dataToUpdate,
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const userData = req.body;
  updateInfo(req, res, userData, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(CREATED_CODE).send({ data: userData });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const avatarLink = req.body;
  updateInfo(req, res, avatarLink, next);
};
