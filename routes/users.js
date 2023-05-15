const router = require('express').Router();
const {
  getAllUsers,
  getUser,
  getMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const { userIdValidate, userInfoValidate, userAvatarValidate } = require('../middlewares/validators/userValidators');

router.get('/', getAllUsers);
router.get('/me', getMe);
router.get('/:userId', userIdValidate, getUser);
router.patch('/me', userInfoValidate, updateUserInfo);
router.patch('/me/avatar', userAvatarValidate, updateUserAvatar);

module.exports = router;
