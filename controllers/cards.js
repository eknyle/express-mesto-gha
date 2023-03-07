const Card = require("../models/card");


module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  ).catch(err => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
  .catch(err => res.status(500).send({ message: err.message }));
};
