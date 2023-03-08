const User = require("../models/user");

class UserNotFound extends Error{
  constructor(status=500,message='Internal Server Error',name='InternalServerError'){
    super();
    this.message= 'Пользователь не найден';
    this.name= 'UserNotFound';
    this.status= 404;
  }
}
class ValidationError extends Error{
  constructor(status=500,message='Internal Server Error',name='InternalServerError'){
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



module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
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

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "UserNotFound") {
        res
          .status(err.status)
          .send({ message: err.message});
      }
      if (err.name === "ValidationError") {
        res
        .status(ValidationError.status)
        .send({ message: `${ValidationError.message} ${err}` });
      } else {
        res.status(InternalServerError.status).send({ message: `${InternalServerError.message} ${err}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
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

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
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
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
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
