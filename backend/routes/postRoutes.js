const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPost,
  getFeed,
  getAllPosts,
  getUserPosts,
  likePost,
  commentPost,
  deletePost,
  uploadPost,
} = require('../controllers/postController');

router.post('/create', protect, uploadPost, createPost);
router.get('/feed', protect, getFeed);
router.get('/explore', protect, getAllPosts);
router.get('/user/:id', protect, getUserPosts);
router.post('/like/:id', protect, likePost);
router.post('/comment/:id', protect, commentPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
