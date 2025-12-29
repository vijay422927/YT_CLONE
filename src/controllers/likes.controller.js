import mongoose from "mongoose";
import { Likes } from "../models/likes.model.js";
import { Apierror } from "../utils/Apierror.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Video } from "../models/video.model.js";


const toggleLikeVideo=async (req,res) => {
    const user=req.user._id;
    const {videoId}=req.query;

    const video=await Video.findById(videoId);
    if(!video){
        throw new Apierror(400,"video Id is Invalid")
    }

    const likes=await Likes.findOne(
        {
            video:videoId,
            likedBy:user
        }
    );

    if(likes)
    {
        await Likes.deleteOne({_id:likes._id});
        
        await Video.findByIdAndUpdate(videoId,{$inc:{likes:-1}});
        return res.status(200).json(new Apiresponse(200,{},"disliked"));
    }
   else
   {
     const likeVideo=await Likes.create(
        {
            video:videoId,
            likedBy:user
        }
    );

    await Video.findByIdAndUpdate(videoId,{$inc:{likes:+1}});

    return res.status(200).json(new Apiresponse(200,likeVideo,"liked succesfully"));
   }
    
};

export{
    toggleLikeVideo
};