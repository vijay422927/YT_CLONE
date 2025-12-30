import mongoose from "mongoose";
import { Likes } from "../models/likes.model.js";
import { Apierror } from "../utils/Apierror.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";


const toggleLikeVideo = async (req, res) => {
    const user = req.user._id;
    const { videoId } = req.query;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new Apierror(400, "video Id is Invalid")
    }

    const likes = await Likes.findOne(
        {
            video: videoId,
            likedBy: user
        }
    );

    if (likes) {
        await Likes.deleteOne({ _id: likes._id });

        await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
        return res.status(200).json(new Apiresponse(200, {}, "disliked"));
    }
    else {
        const likeVideo = await Likes.create(
            {
                video: videoId,
                likedBy: user
            }
        );

        await Video.findByIdAndUpdate(videoId, { $inc: { likes: +1 } });

        return res.status(200).json(new Apiresponse(200, likeVideo, "liked succesfully"));
    }

};


const getAllLikedVideos=async (req,res) => {
       const userId=req.user._id;
       const videos=await Likes.findOne({likedBy:userId}).select("video");
       if(!videos){
         return res.status(200).json(new Apiresponse(200,{},"No videos found"));
       }
       return res.status(200).json(new Apiresponse(200,videos,"get all liked videos"));
};


const toggleCommentLike=async (req,res) => {
    const userId=req.user._id;
    const {commentId}=req.query;

    const comment=await Comment.findById(commentId);
    if(!comment){
        throw new Apierror(400,"Comment Not found")
    }

    const existingLike=await Likes.findOne({comment:commentId,likedBy:userId});
    if(existingLike){
        await Likes.deleteOne({_id:existingLike._id});
        await Comment.findByIdAndUpdate(commentId,{$inc:{likes:-1}});
        return res.status(200).json(new Apiresponse(200,{},"disliked"));
    }
    else{
        const commentLike=await Likes.create(
            {
                comment:commentId,
                likedBy:userId
            }
        );
        await Comment.findByIdAndUpdate(commentId,{$inc:{likes:+1}});
        return res.status(200).json(new Apiresponse(200,commentLike,"liked"));
    }
};
export {
    toggleLikeVideo,
    getAllLikedVideos,
    toggleCommentLike
    
};