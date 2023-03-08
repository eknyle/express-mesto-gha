const Card = require("../models/card");
class CardNotFound extends Error{
  constructor(status=500,message='Internal Server Error'){
    super();
    this.message= 'Карточка не найдена';
    this.name= 'CardNotFound';
    this.status= 404;
  }
}
class ValidationError extends Error{
  constructor(status=500,message='Internal Server Error'){
    super();
    this.message= 'Переданы некорректные данные';
    this.name= 'ValidationError';
    this.status= 400;
  }
}
class InternalServerError extends Error{
  constructor(status=500,message='Внутренняя ошибка сервера',name='InternalServerError'){
    super();
  }
}


module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ValidationError.status)
          .send({ message: `${ValidationError.message} ${err}` });
      } else {
        res.status(InternalServerError.status).send({ message: `${InternalServerError.message} ${err}` });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ValidationError.status)
          .send({ message: `${ValidationError.message} ${err}` });
      }
      if (~err.name.indexOf('NotFound')>=0){
        res
        .status(CardNotFound.status)
        .send({ message: `${CardNotFound.message} ${err}` });
      }
      else {
        res.status(InternalServerError.status).send({ message: `${InternalServerError.message} ${err}` });
      }

    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ValidationError.status)
          .send({ message: `${ValidationError.message} ${err}` });
      }
      if (~err.name.indexOf('NotFound')>=0){
        res
        .status(CardNotFound.status)
        .send({ message: `${CardNotFound.message} ${err}` });
      }
      else {
        res.status(InternalServerError.status).send({ message: `${InternalServerError.message} ${err}` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === "ValidationError") {
      res
        .status(ValidationError.status)
        .send({ message: `${ValidationError.message} ${err}` });
    }
    if (~err.name.indexOf('NotFound')>=0){
      res
      .status(CardNotFound.status)
      .send({ message: `${CardNotFound.message} ${err}` });
    }
    else {
      res.status(InternalServerError.status).send({ message: `${InternalServerError.message} ${err}` });
    }
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === "ValidationError") {
      res
        .status(ValidationError.status)
        .send({ message: `${ValidationError.message} ${err}` });
    }
    if (~err.name.indexOf('NotFound')>=0){
      res
      .status(CardNotFound.status)
      .send({ message: `${CardNotFound.message} ${err}` });
    }
    else {
      res.status(InternalServerError.status).send({ message: `${InternalServerError.message} ${err}` });
    }
  });
};
