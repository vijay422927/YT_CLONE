import express from 'express';
const app=express();
import userRouter from './src/routes/user.router.js';
import videoRouter from './src/routes/video.route.js';
import commentRouter from './src/routes/comment.route.js';
import likeRouter from './src/routes/likes.route.js';
import playListRouter from './src/routes/playlist.route.js';
import subscribeRouter from './src/routes/subscribe.route.js';
import redisClient from './src/services/redis.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

app.use(cors({
  origin: "http://127.0.0.1:5500", 
  credentials: true               
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/v2/user',userRouter);
app.use('/api/v2/video',videoRouter);
app.use('/api/v2/comment',commentRouter);
app.use('/api/v2/like',likeRouter);
app.use('/api/v2/playlist',playListRouter);
app.use('/api/v2/subscribe',subscribeRouter);

await redisClient.set("name","vijay");
const val=await redisClient.get("name");
console.log("redis",val);


export {app};

