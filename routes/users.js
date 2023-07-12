const router = require('express').Router();
const {
  userUpdateValidator,
  userAvatarValidator,
  userIdValidator,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', userIdValidator, getUserById);
router.get('/me', getUserInfo);
router.patch('/me', userUpdateValidator, updateUserInfo);
router.patch('/me/avatar', userAvatarValidator, updateAvatar);
module.exports = router;
