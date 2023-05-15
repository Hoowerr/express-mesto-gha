const router = require('express').Router();

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.use('/signin', require('./signIn'));
router.use('/signup', require('./signUp'));
router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
