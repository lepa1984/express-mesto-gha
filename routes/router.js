const router = require('express').Router();
const userRoutes = require('./user');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { createUser, login } = require('../controllers/users');
const { validLogin, validCreateUser } = require('../middlewares/validation');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/signin', validLogin, login);
router.use('/signup', validCreateUser, createUser);
router.use('/*', auth, (req, res, next) => {
  next(new NotFound('404: Страница не найдена.'));
});

module.exports = router;
