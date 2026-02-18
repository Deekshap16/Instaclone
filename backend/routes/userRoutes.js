const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserById,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers,
  uploadAvatar,
} = require('../controllers/userController');

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserById);
router.put('/update', protect, uploadAvatar, updateProfile);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);

module.exports = router;
