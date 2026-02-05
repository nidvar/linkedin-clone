import express from 'express';
import { getMe, login, logout, refreshAccessToken, signUp } from '../controllers/authControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/logout', logout);

router.get('/me', protectRoute, getMe);
router.get('/refreshaccesstoken', protectRoute, refreshAccessToken);

export default router;