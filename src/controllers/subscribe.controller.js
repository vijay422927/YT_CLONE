import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import User from "../models/user.model.js";
import { Subscribe } from "../models/subscription.model.js";

const toggleSubscribe = async (req, res) => {
    const { channelId } = req.query;
    const userId = req.user._id;

    if (channelId === userId.toString()) {
        throw new Apierror(400, "you are not allow to subscribe");
    }
    const existSub = await Subscribe.findOne({channel:channelId,subscriber:userId});
    if (existSub) {
        await Subscribe.deleteOne({ _id: existSub._id});
        return res.status(200).json(new Apiresponse(200, {}, "unsubscribed"));

    }
    else {
        const sub = await Subscribe.create(
            {
                channel: channelId,
                subscriber: userId
            }
        );
        return res.status(200).json(new Apiresponse(200, sub, "subscribed"));
    }
};



const getAllSubscribed = async (req, res) => {
    const userId = req.user._id;
    const count = await Subscribe.countDocuments(
        {
            subscriber: userId
        }
    );
    if (!count) {
        return res.status(200).json(new Apiresponse(200, {}, "NO SUBSCRIBED"));
    }

    return res.status(200).json(new Apiresponse(200, count, "gett all subscribed"));
};




const getSubscribers = async (req, res) => {
    const { channelId } = req.query;
    const count = await Subscribe.countDocuments({ channel: channelId });
    return res.status(200).json(new Apiresponse(200, count, "gett all subscriptions"));
};



export {
    toggleSubscribe,
    getAllSubscribed,
    getSubscribers
};
//694f8523b3057fd870c13d72