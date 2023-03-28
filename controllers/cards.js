const mongoose = require('mongoose');
const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const CardNotFound = require('../errors/card-not-found-error');
const ValidationError = require('../errors/validation-error');
const CastError = require('../errors/cast-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card_) => {
      if (card_.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(() => {
            throw new CardNotFound();
          })
          .then((card) => res.status(200).send({ data: card }))
          .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
              next(new CastError(err.message));
            }
            if (err instanceof CardNotFound) {
              next(new CardNotFound(err.message));
            }
            return next(err);
          });
      } else {
        next(new ForbiddenError());
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new CastError(err.message));
      }
      if (err instanceof CardNotFound) {
        next(new CardNotFound(err.message));
      }
      if (err instanceof ForbiddenError) {
        next(new ForbiddenError(err.message));
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
        next(new CastError(err.message));
      }
      if (err instanceof CardNotFound) {
        next(new CardNotFound(err.message));
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
        next(new CastError(err.message));
      }
      if (err instanceof CardNotFound) {
        next(new CardNotFound(err.message));
      }
      return next(err);
    });
};
