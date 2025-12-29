import express from 'express';
import { addComment, deleteComment, getVideoComments, updateComment } from '../controllers/comment.controller.js';
import { verifyJwt } from "../middleware/jwt.js";

const router=express.Router();


router.post('/addComment',verifyJwt,addComment);
router.post('/updateComment',verifyJwt,updateComment);
router.delete('/deleteComment',verifyJwt,deleteComment);
router.get('/getComment',verifyJwt,getVideoComments);
export default router;