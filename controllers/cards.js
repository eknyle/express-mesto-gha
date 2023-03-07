const Card = require("../models/card");


module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name==="ValidationError"){
        res.status(400).send({message: `Переданы некорректные данные ${err}`});
      }else{
        res.status(500).send({ message: `Внутренняя ошибка сервера ${err}` });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name==="ValidationError"){
        res.status(400).send({message: `Переданы некорректные данные ${err}`});
      }else{
        res.status(500).send({ message: `Внутренняя ошибка сервера ${err}` });
      }

    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name==="ValidationError"){
        res.status(400).send({message: `Переданы некорректные данные ${err}`});
      }else{
        res.status(500).send({ message: `Внутренняя ошибка сервера ${err}` });
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
    if (err.name==="ValidationError"){
      res.status(400).send({message: `Переданы некорректные данные ${err}`});
    }else{
      res.status(500).send({ message: `Внутренняя ошибка сервера ${err}` });
    }
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name==="ValidationError"){
      res.status(400).send({message: `Переданы некорректные данные ${err}`});
    }else{
      res.status(500).send({ message: `Внутренняя ошибка сервера ${err}` });
    }
  });
};
