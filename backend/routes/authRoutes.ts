import express from 'express';
import { getMe, login, logout, refreshAccessToken, signUp } from '../controllers/authControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/logout', logout);
router.post('/refreshaccesstoken', refreshAccessToken);

router.get('/me', protectRoute, getMe);

export default router;