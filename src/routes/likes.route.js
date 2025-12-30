import express from 'express';
import { getAllLikedVideos, toggleCommentLike, toggleLikeVideo } from '../controllers/likes.controller.js';
import { verifyJwt } from '../middleware/jwt.js';

const router=express.Router();
router.post('/likeVid',verifyJwt,toggleLikeVideo);
router.get('/getAllLiked',verifyJwt,getAllLikedVideos);
router.post('/likecom',verifyJwt,toggleCommentLike);
export default router;