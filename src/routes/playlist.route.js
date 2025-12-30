import express from 'express';
import { verifyJwt } from '../middleware/jwt.js';
import { addVideo, createPlayList, deleteVideo, deletPlayList, getUserPlayList, updateDetails } from '../controllers/playlist.controller.js';
const router=express.Router();

router.post('/playList',verifyJwt,createPlayList);
router.delete('/deletePlayList',verifyJwt,deletPlayList);
router.post('/addvid',verifyJwt,addVideo);
router.delete('/delvid',verifyJwt,deleteVideo);
router.get('/getall',verifyJwt,getUserPlayList);
router.post('/update',verifyJwt,updateDetails);
export default router;