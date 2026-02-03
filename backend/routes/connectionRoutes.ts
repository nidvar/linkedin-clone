import express from 'express';

import { protectRoute } from '../middleware/protectRoute.js';
import { acceptConnectionRequest, getAllConnections, getConnectionRequests, rejectConnectionRequest, removeConnection, sendConnectionRequest } from '../controllers/connectionControllers.js';

const router = express.Router();

router.get('/requests', protectRoute, getConnectionRequests);
router.get('/getallconnections', protectRoute, getAllConnections);

router.get('/accept/:id', protectRoute, acceptConnectionRequest);
router.get('/reject/:id', protectRoute, rejectConnectionRequest);

router.post('/sendRequest/:id', protectRoute, sendConnectionRequest);

router.delete('/removeConnection/:id', protectRoute, removeConnection);

export default router;