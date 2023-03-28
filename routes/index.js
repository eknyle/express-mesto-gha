const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const pattern = /^https?\:\/\/(www\.)?[\w\-\.\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,256}\.[a-zA-Zа-яА-Я]{1,6}#?$/;

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(pattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
