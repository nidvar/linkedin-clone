import express from 'express';

import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotification, getNotifications, markNotificationAsRead } from '../controllers/notificationControllers.js';

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.delete('/delete/:id', protectRoute, deleteNotification);
router.post('/:id/markasread', protectRoute, markNotificationAsRead);

export default router;