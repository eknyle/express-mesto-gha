const mongoose = require('mongoose');
const User = require('../models/user');

class UserNotFound extends Error {
  constructor() {
    super();
    this.message = 'Пользователь не найден';
    this.name = 'UserNotFound';
    this.status = 404;
  }
}

const VALIDATION_ERROR_MESSAGE = 'Переданы некорректные данные';
const VALIDATION_ERROR_CODE = 400;

const CAST_ERROR_MESSAGE = 'Передан некорректный ID';
const CAST_ERROR_CODE = 400;

const SERVER_ERROR_MESSAGE = 'Внутренняя ошибка сервера';
const SERVER_ERROR_CODE = 500;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(CAST_ERROR_CODE).send({ CAST_ERROR_MESSAGE });
      }
      if (err instanceof UserNotFound) {
        return res.status(err.status).send({ message: err.message });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: `${VALIDATION_ERROR_MESSAGE} ${err.message}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFound) {
        return res.status(err.status).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: `${VALIDATION_ERROR_MESSAGE} ${err.message}` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFound) {
        return res.status(err.status).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: `${VALIDATION_ERROR_MESSAGE} ${err.message}` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};
