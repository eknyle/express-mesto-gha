const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getAllUsers, getUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.get('/', auth, getAllUsers);
router.get('/me', auth, getUser);
router.patch('/me', auth, updateUser);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
