import express from 'express';

import { protectRoute } from '../middleware/protectRoute.js';
import { acceptConnectionRequest, getAllConnections, getConnectionRequests, getSentRequests, rejectConnectionRequest, removeConnection, sendConnectionRequest } from '../controllers/connectionControllers.js';

const router = express.Router();

router.get('/requests', protectRoute, getConnectionRequests);
router.get('/getallconnections', protectRoute, getAllConnections);
router.get('/sentrequests', protectRoute, getSentRequests);

router.post('/accept/:id', protectRoute, acceptConnectionRequest);
router.post('/reject/:id', protectRoute, rejectConnectionRequest);

router.post('/sendrequest/:id', protectRoute, sendConnectionRequest);

router.delete('/removeconnection/:id', protectRoute, removeConnection);

export default router;