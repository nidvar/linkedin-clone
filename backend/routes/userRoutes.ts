// Third party packages
import express from 'express';

// Routes
import { protectRoute } from '../middleware/protectRoute.js';

// Controllers
import { findUser, getPublicProfile, suggestedUsers, updateDetails, updateHeaderDetails, updateImage } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/suggestedusers', protectRoute, suggestedUsers);
router.get('/profile/:username', protectRoute, getPublicProfile);
router.get('/finduser/:searchquery', protectRoute, findUser);

router.post('/updateimage', protectRoute, updateImage);
router.post('/updateheader', protectRoute, updateHeaderDetails);
router.post('/updatedetails', protectRoute, updateDetails);

export default router;