const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const pattern = /^https?\:\/\/(www\.)?[\w\-\.\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,256}\.[a-zA-Zа-яА-Я]{1,6}#?$/;
const oidPattern = /^[0-9a-zA-Z]{24}$/;

router.get('/', getAllUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().regex(oidPattern),
  }),
}), getUser);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(pattern),
  }),
}), updateAvatar);

module.exports = router;
