import express from 'express';
import { createComment, createPost, deletePost, getFeedPosts, getPostById } from '../controllers/postControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/post/:id', protectRoute, getPostById);
router.post('/post/:id/createcomment', protectRoute, createComment);

export default router;