import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema=new Schema(
    {
        userName:
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        email:
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        password:
        {
            type:String,
            required:true
        },
        avatar:
        {
            type:String,
            required:true
        },
        coverImage:
        {
            type:String,
            required:true
        },
        refreshToken:
        {
            type:String
        }
    },
    {
        timestamps:true
    }
);
userSchema.pre("save",async function () {
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,10);
    

})

userSchema.methods.isPasswordCorrect=(async function (password) {
    return await bcrypt.compare(password,this.password);
});

userSchema.methods.genarateAccessToken=function () {
    return jwt.sign(
        {
           _id:this._id,
           userName:this.userName,
           email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.genarateRefreshToken=function () {
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User=mongoose.model("user",userSchema);
export default User;