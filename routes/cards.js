const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const pattern = /^https?\:\/\/(www\.)?[\w\-\.\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,256}\.[a-zA-Zа-яА-Я]{1,6}#?$/;
router.get('/', auth, getCards);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(pattern),
  }),
}), createCard);
router.delete('/:cardId', auth, celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().min(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', auth, celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().min(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', auth, celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().min(24),
  }),
}), dislikeCard);

module.exports = router;
