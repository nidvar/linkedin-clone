import express from 'express';
import { createComment, createPost, deleteComment, deletePost, getFeedPosts, getPostById, likePost } from '../controllers/postControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/:id', protectRoute, getPostById);
router.post('/:id/createcomment', protectRoute, createComment);
router.delete('/deletecomment/:id', protectRoute, deleteComment);
router.post('/:id/like', protectRoute, likePost);

export default router;