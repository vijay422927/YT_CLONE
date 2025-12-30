import mongoose, { Schema } from "mongoose";
const subscriptionSchema=new Schema(
    {
        channel:
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        subscriber:
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
);
subscriptionSchema.index({channel:1,subscriber:1},{unique:true});
const Subscribe=mongoose.model("Subscribe",subscriptionSchema);
export {Subscribe};