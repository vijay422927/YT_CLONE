import { PlayList } from "../models/playlist.model.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import { Video } from "../models/video.model.js";
import User from "../models/user.model.js";
import redisClient from "../services/redis.js";

const createPlayList = async (req, res) => {
    const { PlayListname, description } = req.body;
    const userId = req.user._id;
    if (!PlayListname || !description) {
        throw new Apierror(400, "fields are required")
    }

    const existingPlayList = await PlayList.findOne({ name: PlayListname });
    if (existingPlayList) {
        throw new Apierror(400, "alredy playlist name exist")
    }

    const play = await PlayList.create(
        {
            name: PlayListname,
            description,
            owner: userId
        }
    );

    if (!play) {
        throw new Apierror(500, "some thing wnet wrong")
    }

    return res.status(200).json(new Apiresponse(200, play, "playlist created"));

};


const deletPlayList = async (req, res) => {
    const userId = req.user._id;
    const { playlistId } = req.query;
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new Apierror(400, "Playlist Not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        return res.statusI(402).json(new Apiresponse(402, {}, "you are not the valid user"));
    }
    await PlayList.deleteOne({ _id: playlistId });
    return res.status(200).json(new Apiresponse(200, {}, "delete playlist succesfully"));
};



const addVideo = async (req, res) => {
    const userId = req.user._id;
    const { videoId, playlistId } = req.query;
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new Apierror(400, "playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        return res.status(200).json(new Apiresponse(402, {}, "you are not the correct user"));
    }

    const play = await PlayList.findByIdAndUpdate(playlistId, { $addToSet: { videos: videoId } });
    return res.status(200).json(new Apiresponse(200, play, "video added"));
};




const deleteVideo = async (req, res) => {
    const { videoId, playlistId } = req.query;
    const userId = req.user._id;

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new Apierror(400, "playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new Apierror(402, "you are the not valid user")
    }

    await PlayList.findByIdAndUpdate(playlistId, { $pull: { videos: videoId } }, { new: true });
    return res.status(200).json(new Apiresponse(200, {}, "video removed successfulyy"));
};




const getUserPlayList=async (req,res) => {
    const userId=req.user._id;
    const cachkey=`playlist:${userId}`;
    const cachPlaylist=await redisClient.get(cachkey);
    if(cachPlaylist){
        return res.status(200).json(new Apiresponse(200,JSON.parse(cachPlaylist),"get playalist"));
    }
    const playlists=await PlayList.findOne({owner:userId});
    if(!playlists){
        throw new Apierror(400,"playlist not found")
    }
    await redisClient.setEx(cachkey,60,JSON.stringify(playlists));
    return res.status(200).json(new Apiresponse(200,playlists,"gett all playlists"));
};


const updateDetails=async (req,res) => {
    const {playlistId}=req.query;
    const {newname,newdescription}=req.body;
    const playlist=await PlayList.findById(playlistId);
    if(!playlist){
        throw new Apierror(400,"playlist not found")
    }
    
    await PlayList.findByIdAndUpdate(playlistId,{$set:{name:newname,description:newdescription}},{new:true});
    return res.status(200).json(new Apiresponse(200,{},"update details succesfully"));

};

export {
    createPlayList,
    deletPlayList,
    addVideo,
    deleteVideo,
    getUserPlayList,
    updateDetails
};