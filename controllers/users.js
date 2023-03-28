const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserNotFound = require('../errors/user-not-found-error');
const DuplicateError = require('../errors/duplicate-error');
const ValidationError = require('../errors/validation-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const CastError = require('../errors/cast-error');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new CastError(err.message));
      }
      if (err instanceof UserNotFound) {
        return next(new UserNotFound(err.message));
      }

      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new CastError(err.message));
      }
      if (err instanceof UserNotFound) {
        return next(new UserNotFound(err.message));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '29ea2afd00fdec957d31555f5aa99601b10fd99c29928f242328168a78eae737', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => next(new UnauthorizedError(err.message)))
    .catch(next);
};

// исправить возвращаемый объект!! без хэша надо
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user.removePassword() }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(err.message));
      }
      if (err.code === 11000) {
        return next(new DuplicateError(err.message));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFound) {
        return next(new UserNotFound(err.message));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFound) {
        return next(new UserNotFound(err.message));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};
