const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().min(24),
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
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);

module.exports = router;
