import express from 'express';
const app=express();
import userRouter from './src/routes/user.router.js';
import videoRouter from './src/routes/video.route.js';
import commentRouter from './src/routes/comment.route.js';
import likeRouter from './src/routes/likes.route.js';
import playListRouter from './src/routes/playlist.route.js';
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cookieParser());
app.use('/api/v2/user',userRouter);
app.use('/api/v2/video',videoRouter);
app.use('/api/v2/comment',commentRouter);
app.use('/api/v2/like',likeRouter);
app.use('/api/v2/playlist',playListRouter);
export {app};