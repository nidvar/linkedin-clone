// Third party packages
import express from 'express';

// Routes
import { protectRoute } from '../middleware/protectRoute.js';

// Controllers
import { getPublicProfile, suggestedUsers } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/suggestedusers', protectRoute, suggestedUsers);
router.get('/profile/:username', protectRoute, getPublicProfile);

export default router;