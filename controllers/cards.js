const mongoose = require('mongoose');
const Card = require('../models/card');

class CardNotFound extends Error {
  constructor() {
    super();
    this.message = 'Карточка не найдена';
    this.name = 'CardNotFound';
    this.status = 404;
  }
}

const CAST_ERROR_MESSAGE = 'Передан некорректный ID';
const CAST_ERROR_CODE = 400;

const VALIDATION_ERROR_MESSAGE = 'Переданы некорректные данные';
const VALIDATION_ERROR_CODE = 400;

const SERVER_ERROR_MESSAGE = 'Внутренняя ошибка сервера';
const SERVER_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: `${VALIDATION_ERROR_MESSAGE} ${err.message}` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(CAST_ERROR_CODE).send({ CAST_ERROR_MESSAGE });
      }
      if (err instanceof CardNotFound) {
        return res.status(err.status).send({ message: `${err.message}` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
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
        return res.status(CAST_ERROR_CODE).send({ CAST_ERROR_MESSAGE });
      }
      if (err instanceof CardNotFound) {
        return res.status(err.status).send({ message: `${err.message}` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
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
        return res.status(CAST_ERROR_CODE).send({ CAST_ERROR_MESSAGE });
      }
      if (err instanceof CardNotFound) {
        return res.status(err.status).send({ message: `${err.message}` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `${SERVER_ERROR_MESSAGE} ${err.message}` });
    });
};
