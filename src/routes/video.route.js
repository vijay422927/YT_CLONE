import express from 'express';
import { getVideoWithSearch, getAllVideos, publishVideo, updateVideo, deleteVideo } from '../controllers/video.controller.js';
import { verifyJwt } from '../middleware/jwt.js';
import { uploads } from '../middleware/multer.js';


const router=express.Router();
router.post('/publish',uploads.fields([{name:"videoFile",maxCount:1},{name:"thumbNail",maxCount:1}]),verifyJwt,publishVideo);
router.get('/getall',verifyJwt,getAllVideos);
router.get('/search',verifyJwt,getVideoWithSearch);
router.post('/update',uploads.fields([{name:"videoFile",maxCount:1}]),verifyJwt,updateVideo);
router.delete('/delete',verifyJwt,deleteVideo);
export default router;