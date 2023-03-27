const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
