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

router.get('/', auth, getCards);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri(),
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
