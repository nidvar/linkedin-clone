import express from 'express';
import { createComment, createPost, deletePost, getFeedPosts, getPostById, likePost } from '../controllers/postControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/post/:id', protectRoute, getPostById);
router.post('/post/:id/createcomment', protectRoute, createComment);
router.post('/post/:id/like', protectRoute, likePost);

export default router;