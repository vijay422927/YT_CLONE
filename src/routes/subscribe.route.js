import express from 'express';
import { verifyJwt } from '../middleware/jwt.js';
import { getAllSubscribed, getSubscribers, toggleSubscribe } from '../controllers/subscribe.controller.js';
const router=express.Router();
router.post('/toggleSub',verifyJwt,toggleSubscribe);
router.get('/getsubscribers',verifyJwt,getSubscribers);
router.get('/getsubscribed',verifyJwt,getAllSubscribed);

export default router;
