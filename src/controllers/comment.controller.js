import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import redisClient from "../services/redis.js";

const addComment=async (req,res) => {
    const {videoId}=req.query;
    const userId=req.user._id;
    const {content}=req.body;

    if(!content)
    {
        throw new Apierror(400,"content is required for the comment")
    }

    const comment=await Comment.create(
        {
            content,
            video:videoId,
            owner:userId
        }
    );
    if(!comment)
    {
        throw new Apierror(500,"something went wrong at comment")
    }

    return res.status(200).json(new Apiresponse(200,comment,"add comment successfully"));

};

const updateComment=async (req,res) => {
    const {commentId}=req.query;
    const {newcontent}=req.body;
    const userId=req.user._id;
    if(!newcontent)
    {
        throw new Apierror(400,"content is Required")
    }


    const comment=await Comment.findById(commentId);
    if(!comment)
    {
       throw new Apierror(404,"Invalid comment id")
    }


    if(comment.owner.toString()!==userId.toString())
    {
        throw new Apierror(402,"you are not the correct user");
    }

    await Comment.findByIdAndUpdate(commentId,{$set:{content:newcontent}});
    return res.status(200).json(new Apiresponse(200,{},"update comment successfully"));
};

const deleteComment=async (req,res) => {
    const{commentId}=req.query;
    const userId=req.user._id;
    
    const comment=await Comment.findById(commentId);
    if(!comment)
    {
        throw new Apierror(400,"invalid comment id")
    }

    if(comment.owner.toString()!==userId.toString())
    {
        throw new Apierror(402,"you are not the correct user")
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json(new Apiresponse(200,{},"comment delete succesfully"));
};



const getVideoComments=async (req,res) => {
    const {videoId}=req.query;
    const cachkey=`video:${videoId}`;
    const cachComments=await redisClient.get(cachkey);
    if(cachComments)
    {
        return res.status(200).json(new Apiresponse(200,JSON.parse(cachComments),"get all commments"));
    }
    const comments=await Comment.find({video:videoId}).select("content owner");
    if(!comments)
    {
        throw new Apierror(400,"invalid videoId")
    }
    await redisClient.setEx(cachkey,60,JSON.stringify(comments));
    return res.status(200).json(new Apiresponse(200,comments,"get all remotes"));
};



export{
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
};