// Third party packages
import express from 'express';

// Routes
import { protectRoute } from '../middleware/protectRoute.js';

// Controllers
import { getPublicProfile, suggestedUsers, updateHeaderDetails, updateProfilePic } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/suggestedusers', protectRoute, suggestedUsers);
router.get('/profile/:username', protectRoute, getPublicProfile);
router.post('/updateprofilepic', protectRoute, updateProfilePic);
router.post('/updateheader', protectRoute, updateHeaderDetails);

export default router;