import express from 'express';

import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotification, getNotifications, markNotificationAsRead } from '../controllers/notificationControllers.js';

const router = express.Router();

router.get('/notifications', protectRoute, getNotifications);
router.delete('/notifications/:id', protectRoute, deleteNotification);
router.post('/notifications/:id/markasread', protectRoute, markNotificationAsRead);

export default router;