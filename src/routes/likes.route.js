import express from 'express';
import { toggleLikeVideo } from '../controllers/likes.controller.js';
import { verifyJwt } from '../middleware/jwt.js';

const router=express.Router();
router.post('/likeVid',verifyJwt,toggleLikeVideo);
export default router;