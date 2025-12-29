import dotenv from 'dotenv';
import mongoose from "mongoose";
import { dot } from 'node:test/reporters';
dotenv.config();
const connectDb= async ()=>{
    try {
        const connectionInstance=mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
        console.log(`connection succesfull`,(await connectionInstance).Connection.name);
    } catch (error) {
        console.log("connection failed",error);
        process.exit(1);
    }
    
};
export {connectDb};