const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserNotFound = require('../errors/user-not-found-error');
const errors = require('../errors/error-codes');
const { celebrate, Joi } = require('celebrate');

//29ea2afd00fdec957d31555f5aa99601b10fd99c29928f242328168a78eae737

/* router.delete('/:postId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    // валидируем заголовки
  }),
  query: Joi.object().keys({
    // валидируем query
  }),
}), deletePost);


router.delete('/:postId', celebrate({
  headers: Joi.object().keys({
    // валидируем заголовки
  }).unknown(true),
}), deletePost);


 */
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {

  const { id } = req.body;
  User.findById(id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(errors.CAST_ERROR_CODE).send({ message: errors.CAST_ERROR_MESSAGE });
      }
      if (err instanceof UserNotFound) {
        return res.status(err.status).send({ message: err.message });
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
    .catch((err) => {
      res
        .status(errors.UNAUTHORIZED_ERROR_CODE)
        .send({ message: `${errors.UNAUTHORIZED_ERROR_MESSAGE} ${err.message}` });
    })
    .catch(next);
};

// исправить возвращаемый объект!! без хэша надо
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash });
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(errors.VALIDATION_ERROR_CODE).send({ message: `${errors.VALIDATION_ERROR_MESSAGE} ${err.message}` });
      }

      if (err.code === 11000){
        res.status(errors.DUPLICATE_ERROR_CODE).send({ message: `${errors.DUPLICATE_ERROR_MESSAGE} ${err.message}` });
      } else {
        next(err);
      }
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
        return res.status(err.status).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(errors.VALIDATION_ERROR_CODE).send({ message: `${errors.VALIDATION_ERROR_MESSAGE} ${err.message}` });
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
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFound) {
        return res.status(err.status).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(errors.VALIDATION_ERROR_CODE).send({ message: `${errors.VALIDATION_ERROR_MESSAGE} ${err.message}` });
      }
      return next(err);
    });
};
