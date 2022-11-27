const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/me', getUserMe);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
