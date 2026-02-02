import express from 'express';
import { createPost, deletePost, getFeedPosts } from '../controllers/postControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);

export default router;