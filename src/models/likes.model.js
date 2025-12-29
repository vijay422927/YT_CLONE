import mongoose, { Schema } from "mongoose";

const likeSchema=new Schema(
    {
        video:
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        comment:
        {
            type:Schema.Types.ObjectId,
            ref:"Comment"
        },
        likedBy:
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    }
);
likeSchema.index({video:1,likedBy:1},{unique:true,partialFilterExpression:{video:{$ne:null}}});
likeSchema.index({comment:1,likedBy:1},{unique:true,partialFilterExpression:{comment:{$ne:null}}});
const Likes=mongoose.model("Likes",likeSchema);
export {Likes};