import { changeAvatar, changeCoverImage, changePassword, getCurrentUser, loginUser, logOutUser, refreshAccessToken, registerUser, updateDetails } from "../controllers/user.controller.js";
import express from 'express';
import { uploads } from "../middleware/multer.js";
import { verifyJwt } from "../middleware/jwt.js";
const router=express.Router();

router.post('/register',uploads.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]),registerUser);
router.post('/login',loginUser);
router.post('/logout',verifyJwt,logOutUser);
router.post('/changePassword',verifyJwt,changePassword);
router.post('/changeAvatar',uploads.fields([{name:"avatar",maxCount:1}]),verifyJwt,changeAvatar);
router.post('/changeCoverImage',uploads.fields([{name:"coverImage",maxCount:1}]),verifyJwt,changeCoverImage);
router.post('/genarateAcessToken',refreshAccessToken);
router.get('/currentUser',verifyJwt,getCurrentUser);
router.post('/updateDetails',verifyJwt,updateDetails);
export default router;