import User from "../models/user.model.js";
import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { AsynchHanadler } from "../utils/Asynchhandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken';



const genarateAccessRefresh=async (userId) => {
    
    const user=await User.findById(userId);
    if(!user){
        throw new Apierror(409,"User Id is InCorrect")
    }

    const accessToken=user.genarateAccessToken();
    const refreshToken=user.genarateRefreshToken();
    

    user.refreshToken=refreshToken;
    user.save({validateBeforeSave:false});

    
    return {accessToken,refreshToken};  
};



const registerUser = async (req, res) => {

    const { userName, email, password } = req.body;


    if (!userName || !email || !password) {
        throw new Apierror(409, "All Fields Are Required");
    }

    const existUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existUser) {
        throw new Apierror(409, "User Alredy Registered");
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLoacalPath=req.files?.coverImage[0]?.path;
    
    const avatarResponse=await uploadCloudinary(avatarLocalPath);
    const coverImageResponse=await uploadCloudinary(coverImageLoacalPath);

    if(!avatarLocalPath)
    {
        throw new Apierror(400,"Filed is required");
    }

    const user=await User.create(
        {
            userName,
            email,
            password,
            avatar:avatarResponse.url,
            coverImage:coverImageResponse.url
        }
    );

    const finalUser=await User.findById(user._id).select('-password -refreshToken');
    res.status(200).json( new Apiresponse(200,finalUser,"Register Succesfully"));
};



const loginUser=async (req,res) => {

    const{email,password}=req.body;

    if([email,password].some((filed)=>filed?.trim() ==="")){
        throw new Apierror(400,"All Fields Are Required")
    }
    
    const existUser=await User.findOne({email});
    if(!existUser){
        throw new Apierror(409,"User is Not Registered")
    }

    const isPasswordMatch=existUser.isPasswordCorrect(password);
    if(!isPasswordMatch){
        throw new Apierror(407,"Password is Incorrect")
    }

    const{accessToken,refreshToken}=await genarateAccessRefresh(existUser._id);
    
    
    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"

    };

    const loggedUser=await User.findById(existUser._id).select('-password -refreshToken');
    
    res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(new Apiresponse(200,loggedUser,"User Login Successfuly"));

};


const logOutUser=async (req,res) => {
    const userId=req.user._id;

   await User.findByIdAndUpdate(userId,{$unset:{refreshToken:1}});
    
   const options={
    httpOnly:true,
    secure:true
   };

    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new Apiresponse(200,{},"User loggedOut sccesfully"));
};

const changePassword=async (req,res) => {
    const{newPassword}=req.body;
    const userId=req.user._id;

    await User.findByIdAndUpdate(userId,{$set:{password:newPassword}});
    
    res
    .status(200)
    .json(new Apiresponse(200,{},"Password changed"))
};

const changeAvatar=async (req,res) => {
    const avatar=req.files?.avatar[0]?.path;
 
    
    const userId=req.user._id;

    const user=await User.findById(userId);
    if(!user){
        throw new Apierror(400,"user is not valid");
    }

    const avatarLocalPath=await uploadCloudinary(avatar);
    if(!avatarLocalPath){
        throw new Apierror(400,"something went wrong at the time of cloudinary")
    }
    
    await User.findByIdAndUpdate(userId,{$set:{avatar:avatarLocalPath.url}})

    res
    .status(200)
    .json(new Apiresponse(200,{},"avatar chnaged succesfully"));

};

const changeCoverImage=async (req,res) => {
    const userId=req.user._id;
    const coverImage=req.files?.coverImage[0]?.path;

    const user=await User.findById(userId);
    const coverImageLoacalPath=await uploadCloudinary(coverImage);
    if(!coverImageLoacalPath){
        throw new Apierror(409,"Not get url from cloudinary")
    }

    await User.findByIdAndUpdate(userId,{$set:{coverImage:coverImageLoacalPath.url}});
    res
    .status(200)
    .json(new Apiresponse(200,{},"coverImage changed successfully"));
};

const refreshAccessToken=async (req,res) => {
    const incomingrefreshToken=req.cookies?.refreshToken || req.body?.refreshToken;
     
    const decode=jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET);
    const user=await User.findById(decode._id);
    if(!user){
        throw new Apierror(409,"invalid token")
    }
    
    if(incomingrefreshToken!==user?.refreshToken){
         throw new Apierror(409,"expired or reused")
    }

    const options={
        httpOnly:true,
        secure:true
    }
    const{accessToken,refreshToken}=await genarateAccessRefresh(user._id);
    
    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new Apiresponse(200,{accessToken},"Accesstoken refreshed"));

};

const getCurrentUser=async (req,res) => {
    const userId=req.user._id;
    const user=await User.findById(userId).select('-password -refreshToken');
    if(!user){
        throw new Apierror(409,"Unauthorized User")
    }

    res
    .status(200)
    .json(new Apiresponse(200,user,"get current user"));
    
};

const updateDetails=async (req,res) => {
    const{email,userName}=req.body;
    const userId=req.user._id;
    await User.findByIdAndUpdate(userId,{$set:{email:email,userName:userName}});
    return res.status(200).json(new Apiresponse(200,{},"update details succesfully"));
};

export {
 registerUser,
 loginUser,
 logOutUser,
 changePassword,
 changeAvatar,
 changeCoverImage,
 refreshAccessToken,
 getCurrentUser,
 updateDetails
};