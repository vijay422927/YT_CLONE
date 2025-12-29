import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { uploadCloudinary } from "../utils/cloudinary.js";


const publishVideo = async (req, res) => {
    const userId = req.user._id;
    const { tittle, description } = req.body;
    if ([tittle, description].some((field) => field?.trim() === "")) {
        throw new Apierror(404, "tittle and description are required")
    }


    const videoFilePath = req.files?.videoFile[0]?.path;
    const thumbNailPath = req.files?.thumbNail[0]?.path;



    if (!videoFilePath || !thumbNailPath) {
        throw new Apierror(404, "video and thumbnail iss required")
    }


    const videFilecloud = await uploadCloudinary(videoFilePath);
    const thumbNailcloud = await uploadCloudinary(thumbNailPath);

    console.log(videFilecloud);
    console.log(thumbNailcloud);




    if (!videFilecloud || !thumbNailcloud) {
        throw new Apierror(404, "some thing went wrong from cloudinary")
    }

    const publish = await Video.create(
        {
            videoFile: videFilecloud.url,
            thumbNail: thumbNailcloud.url,
            tittle,
            description,
            duration: Math.round(videFilecloud.duration),
            owner: userId
        }
    );
    if (!publish) {
        throw new Apierror(404, "something went wrong at the time of db insertion")
    }

    return res.status(200).json(new Apiresponse(200, publish, "video published succesfully"));
};


const getAllVideos = async (req, res) => {
    const userId = req.user._id;

    const docs = await Video.find({ owner: userId }).select("videoFile thumbNail duration likes");
    if (!docs) {
        throw new Apierror(402, "unauthorized or invalid user");
    }

    return res.status(200).json(new Apiresponse(200, docs, "gett all videos"));
};



const getVideoWithSearch = async (req, res) => {
    const { qu } = req.query;
    if (!qu || qu.trim() === "") {
        throw new Apierror(400, " required");
    }

    const videos = await Video.find({
        $or: [
            { tittle: { $regex: qu.trim(), $options: "i" } },
            { description: { $regex: qu.trim(), $options: "i" } }
        ]
    })
        .select("videoFile thumbNail likes duration");
    if (videos.length === 0) {
        return res.status(200).json(new Apiresponse(200, {}, "no videos found"))
    }

    return res.status(200).json(new Apiresponse(200, videos, "get videos by search"));
};


const updateVideo = async (req, res) => {
    const { videoId } = req.query;
    const videoFilePath = req.files?.videoFile[0]?.path;
    if (!videoFilePath) {
        throw new Apierror(400, "video is required")
    }

    const videFilecloud = await uploadCloudinary(videoFilePath);
    if (!videFilecloud) {
        throw new Apierror(500, "some thing went wrong at cloudinary")
    }

    const updateVid = await Video.findByIdAndUpdate(videoId, { $set: { videoFile: videFilecloud.url } });
    if (!updateVid) {
        return res.status(200).json(new Apiresponse(200, {}, "video is not uploaded"))
    }

    return res.status(200).json(new Apiresponse(200, {}, "update video successfully"));
};

const deleteVideo=async (req,res) => {
    const {videoId}=req.query;
    const userId=req.user._id;
     
    const videos=await Video.findById(videoId);
    if(videos.owner.toString()!==userId.toString()){
        throw new Apierror(500,"you are the not the correct user")
    }

    await Video.findByIdAndDelete(videoId);
    return res.status(200).json(new Apiresponse(200,{},"video delete successfully"));
};
export {
    publishVideo,
    getAllVideos,
    getVideoWithSearch,
    updateVideo,
    deleteVideo
};