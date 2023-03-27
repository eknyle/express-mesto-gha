const mongoose = require('mongoose');
const Card = require('../models/card');
const errors = require('../errors/error-codes');

class CardNotFound extends Error {
  constructor() {
    super();
    this.message = 'Карточка не найдена';
    this.name = 'CardNotFound';
    this.status = 404;
  }
}


module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(errors.VALIDATION_ERROR_CODE)
          .send({ message: `${errors.VALIDATION_ERROR_MESSAGE} ${err.message}` });
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(errors.CAST_ERROR_CODE).send({ message: errors.CAST_ERROR_MESSAGE });
      }
      if (err instanceof CardNotFound) {
        return res.status(err.status).send({ message: `${err.message}` });
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(errors.CAST_ERROR_CODE).send({ message: errors.CAST_ERROR_MESSAGE });
      }
      if (err instanceof CardNotFound) {
        return res.status(err.status).send({ message: `${err.message}` });
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(errors.CAST_ERROR_CODE).send({ message: errors.CAST_ERROR_MESSAGE });
      }
      if (err instanceof CardNotFound) {
        return res.status(err.status).send({ message: `${err.message}` });
      }
      return next(err);
    });
};
