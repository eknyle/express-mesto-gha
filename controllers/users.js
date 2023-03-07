const User = require("../models/user");


module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
};
